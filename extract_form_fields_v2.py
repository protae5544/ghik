import cv2
import numpy as np
from pdf2image import convert_from_path
import pytesseract
import json
import os
import re
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTRect, LTLine

def load_template_fields(template_path):
    """โหลดรายชื่อฟิลด์จาก template"""
    with open(template_path, 'r', encoding='utf-8') as f:
        template = json.load(f)
    
    # แปลง nested dict เป็น flat dict
    fields = {}
    def flatten_dict(d, parent_key=''):
        for k, v in d.items():
            new_key = f"{parent_key}.{k}" if parent_key else k
            if isinstance(v, dict) and not any(key in v for key in ['type', 'name_th', 'name_en']):
                flatten_dict(v, new_key)
            else:
                fields[new_key] = v
    
    flatten_dict(template)
    return fields

def create_dotted_line_template(width=100, height=20):
    """สร้าง template สำหรับเส้นประ"""
    template = np.zeros((height, width), dtype=np.uint8)
    for i in range(0, width, 10):
        cv2.line(template, (i, height//2), (i+5, height//2), 255, 1)
    return template

def create_box_template(width=100, height=20):
    """สร้าง template สำหรับกล่องสี่เหลี่ยม"""
    template = np.zeros((height, width), dtype=np.uint8)
    cv2.rectangle(template, (0, 0), (width-1, height-1), 255, 1)
    return template

def match_template(img, template, threshold=0.8):
    """ใช้ template matching เพื่อหาตำแหน่งที่ตรงกับ template"""
    w, h = template.shape[::-1]
    res = cv2.matchTemplate(img, template, cv2.TM_CCOEFF_NORMED)
    locations = np.where(res >= threshold)
    matches = []
    for pt in zip(*locations[::-1]):
        matches.append((pt[0], pt[1], w, h))
    return matches

def analyze_pdf_layout(pdf_path):
    """วิเคราะห์ layout ของ PDF ด้วย pdfminer"""
    fields = []
    for page_num, page_layout in enumerate(extract_pages(pdf_path)):
        # หากล่องและเส้น
        for element in page_layout:
            if isinstance(element, (LTRect, LTLine)):
                x0, y0, x1, y1 = element.bbox
                w = x1 - x0
                h = y1 - y0
                
                # กรองขนาดที่น่าจะเป็น field
                if w > 30 and h > 10:
                    nearby_text = ""
                    
                    # หาข้อความใกล้เคียง
                    for text_element in page_layout:
                        if isinstance(text_element, LTTextContainer):
                            tx0, ty0, tx1, ty1 = text_element.bbox
                            # ถ้าข้อความอยู่ใกล้กล่อง/เส้น
                            if abs(tx0 - x0) < 50 and abs(ty0 - y0) < 50:
                                nearby_text += text_element.get_text() + " "
                    
                    fields.append({
                        "page": page_num,
                        "x": int(x0),
                        "y": int(y0),
                        "width": int(w),
                        "height": int(h),
                        "nearby_text": nearby_text.strip(),
                        "source": "layout"
                    })
    
    return fields

def find_form_fields_v2(pdf_path, template_fields, output_path):
    # หา field จาก PDF layout
    layout_fields = analyze_pdf_layout(pdf_path)
    
    # แปลง PDF เป็นภาพ
    images = convert_from_path(pdf_path)
    image_fields = []
    
    # สร้าง template สำหรับ matching
    dotted_template = create_dotted_line_template()
    box_template = create_box_template()
    
    # ประมวลผลแต่ละหน้า
    for page_num, image in enumerate(images):
        # แปลงเป็น OpenCV format
        img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # หา field ด้วย template matching
        matches1 = match_template(gray, dotted_template)
        matches2 = match_template(gray, box_template)
        
        # รวม matches
        for x, y, w, h in matches1 + matches2:
            # ขยายพื้นที่เล็กน้อยเพื่อให้ครอบคลุมข้อความรอบๆ
            roi = gray[max(0, y-20):min(gray.shape[0], y+h+20), 
                      max(0, x-20):min(gray.shape[1], x+w+20)]
            
            try:
                text = pytesseract.image_to_string(roi, lang='tha+eng')
                text = ' '.join(text.split())
            except:
                text = ""
            
            image_fields.append({
                "page": page_num,
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "nearby_text": text,
                "source": "template_matching"
            })
    
    # รวม fields จากทั้งสองวิธี
    all_fields = layout_fields + image_fields
    
    # กรอง fields ที่ซ้ำกัน
    unique_fields = []
    used_positions = set()
    
    for field in all_fields:
        pos_key = (field['page'], field['x'], field['y'])
        if pos_key not in used_positions:
            used_positions.add(pos_key)
            
            # พยายามจับคู่กับ template
            text = field['nearby_text'].lower()
            field_name = None
            field_type = None
            
            for template_field, template_value in template_fields.items():
                if isinstance(template_value, str):
                    template_text = re.sub(r'[^\u0E00-\u0E7Fa-zA-Z0-9\s]', '', template_value).lower()
                    if template_text and text:
                        if template_text in text or text in template_text:
                            field_name = template_field
                            field_type = template_value
                            break
            
            field['field_name'] = field_name
            field['field_type'] = field_type
            unique_fields.append(field)
    
    # เรียงลำดับตาม y แล้ว x
    unique_fields.sort(key=lambda f: (f['page'], f['y'], f['x']))
    
    # บันทึก mapping ลงไฟล์
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            "form_name": "บต.44",
            "total_pages": len(images),
            "fields": unique_fields
        }, f, ensure_ascii=False, indent=2)
    
    return unique_fields

if __name__ == "__main__":
    # โหลด template
    template_path = "bt44_template.json"
    if not os.path.exists(template_path):
        print(f"ไม่พบไฟล์ template: {template_path}")
        exit(1)
    
    template_fields = load_template_fields(template_path)
    
    # ทดสอบกับฟอร์ม บต.44
    pdf_path = "บต.44.pdf"
    output_path = "bt44_field_positions.json"
    
    if os.path.exists(pdf_path):
        print(f"กำลังประมวลผลไฟล์ {pdf_path}...")
        print(f"พบ {len(template_fields)} fields ใน template")
        
        fields = find_form_fields_v2(pdf_path, template_fields, output_path)
        print(f"พบ {len(fields)} fields ในเอกสาร")
        print(f"บันทึกผลลงในไฟล์ {output_path}")
    else:
        print(f"ไม่พบไฟล์ {pdf_path}")
