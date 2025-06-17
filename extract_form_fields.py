import cv2
import numpy as np
from pdf2image import convert_from_path
import pytesseract
import json
import os
import re

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

def find_form_fields(pdf_path, template_fields, output_path):
    # แปลง PDF เป็นภาพ
    images = convert_from_path(pdf_path)
    
    # เก็บข้อมูล field ทั้งหมด
    fields = []
    
    # ประมวลผลแต่ละหน้า
    for page_num, image in enumerate(images):
        # แปลงเป็น OpenCV format
        img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # วิธีที่ 1: หาช่องว่างสีขาว
        _, binary = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
        contours1, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # วิธีที่ 2: หาเส้นประ/กรอบ
        edges = cv2.Canny(gray, 30, 100)
        kernel = np.ones((3,3), np.uint8)
        dilated = cv2.dilate(edges, kernel, iterations=1)
        contours2, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # รวม contours จากทั้งสองวิธี
        all_contours = contours1 + contours2
        
        # กรองและรวม contours
        field_contours = []
        for contour in all_contours:
            x, y, w, h = cv2.boundingRect(contour)
            area = cv2.contourArea(contour)
            aspect_ratio = float(w)/h
            
            # กรองขนาดและอัตราส่วน
            min_width = 40
            min_height = 15
            min_area = 300
            min_aspect = 0.8
            max_aspect = 10
            
            if (w >= min_width and h >= min_height and 
                area >= min_area and 
                min_aspect <= aspect_ratio <= max_aspect):
                
                # ตรวจสอบการซ้อนทับ
                overlap = False
                for fx, fy, fw, fh in field_contours:
                    if (abs(x - fx) < min_width and abs(y - fy) < min_height) or \
                       (x >= fx and x <= fx+fw and y >= fy and y <= fy+fh) or \
                       (x+w >= fx and x+w <= fx+fw and y+h >= fy and y+h <= fy+fh):
                        overlap = True
                        break
                
                if not overlap:
                    field_contours.append((x, y, w, h))
        
        # ประมวลผลแต่ละ field ที่พบ
        for x, y, w, h in field_contours:
            # ขยายพื้นที่เล็กน้อยเพื่อให้ครอบคลุมข้อความรอบๆ
            roi = gray[max(0, y-20):min(gray.shape[0], y+h+20), 
                      max(0, x-20):min(gray.shape[1], x+w+20)]
            
            # ใช้ OCR อ่านข้อความรอบๆ field
            try:
                text = pytesseract.image_to_string(roi, lang='tha+eng')
                text = ' '.join(text.split())  # ลบ whitespace ที่ไม่จำเป็น
            except:
                text = ""
            
            # พยายามจับคู่กับชื่อฟิลด์จาก template
            field_name = None
            field_type = None
            
            # ทำความสะอาดข้อความ
            text = ' '.join(text.split())  # ลบ whitespace ที่ไม่จำเป็น
            text = re.sub(r'[^\u0E00-\u0E7Fa-zA-Z0-9\s]', '', text)  # เก็บแค่ตัวอักษรไทย, อังกฤษ, ตัวเลข
            
            # หาคำที่ใกล้เคียงที่สุดใน template
            max_similarity = 0
            for template_field, template_value in template_fields.items():
                if isinstance(template_value, str):
                    # คำนวณความเหมือน
                    template_text = re.sub(r'[^\u0E00-\u0E7Fa-zA-Z0-9\s]', '', template_value)
                    if template_text and text:
                        similarity = len(set(template_text.lower().split()) & set(text.lower().split())) / \
                                   len(set(template_text.lower().split()))
                        if similarity > max_similarity and similarity > 0.3:  # threshold 30%
                            max_similarity = similarity
                            field_name = template_field
                            field_type = template_value
            
            # เก็บข้อมูล field
            field = {
                "page": page_num,
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "nearby_text": text,
                "field_name": field_name,
                "field_type": field_type
            }
            fields.append(field)
    
    # เรียงลำดับตาม y แล้ว x
    fields.sort(key=lambda f: (f['page'], f['y'], f['x']))
    
    # บันทึก mapping ลงไฟล์
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            "form_name": "บต.44",
            "total_pages": len(images),
            "fields": fields
        }, f, ensure_ascii=False, indent=2)

    return fields

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
        
        fields = find_form_fields(pdf_path, template_fields, output_path)
        print(f"พบ {len(fields)} fields ในเอกสาร")
        print(f"บันทึกผลลงในไฟล์ {output_path}")
    else:
        print(f"ไม่พบไฟล์ {pdf_path}")
