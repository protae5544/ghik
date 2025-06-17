import pytesseract
from pdf2image import convert_from_path
import json
import numpy as np
import cv2
from collections import defaultdict

def detect_dotted_lines(image):
    """ตรวจจับเส้นประที่เป็นช่องกรอก"""
    # แปลงภาพเป็น numpy array ถ้ายังไม่ใช่
    if not isinstance(image, np.ndarray):
        image = np.array(image)
    
    # แปลงเป็นภาพขาวดำ
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    else:
        gray = image
    
    height, width = gray.shape
    
    # ปรับความคมชัดและความสว่าง
    gray = cv2.equalizeHist(gray)
    
    # ใช้ adaptive threshold เพื่อแยกเส้นประออกจากพื้นหลัง
    binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
    
    # ใช้ morphological operations เพื่อเชื่อมเส้นประ
    kernel_h = np.ones((1, 5), np.uint8)  # kernel แนวนอน
    kernel_v = np.ones((5, 1), np.uint8)  # kernel แนวตั้ง
    
    # เชื่อมเส้นประแนวนอนและแนวตั้ง
    dilated_h = cv2.dilate(binary, kernel_h, iterations=1)
    dilated_v = cv2.dilate(binary, kernel_v, iterations=1)
    dilated = cv2.bitwise_or(dilated_h, dilated_v)
    
    # หา contours
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    dotted_fields = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        min_w = 50  # ความกว้างขั้นต่ำของช่องกรอก
        max_w = width * 0.8  # ความกว้างสูงสุด (80% ของความกว้างหน้า)
        min_h = 20  # ความสูงขั้นต่ำ
        max_h = 40  # ความสูงสูงสุด
        
        if min_w < w < max_w and min_h < h < max_h:
            dotted_fields.append({
                'x': x,
                'y': y,
                'width': w,
                'height': h
            })
    
    return dotted_fields

def extract_text_with_layout(image):
    """ใช้ Tesseract OCR อ่านข้อความพร้อมตำแหน่ง"""
    custom_config = r'--oem 3 --psm 11 -l tha+eng'
    data = pytesseract.image_to_data(image, config=custom_config, output_type=pytesseract.Output.DICT)
    
    # จัดกลุ่มข้อความตาม block และ line
    blocks = defaultdict(list)
    for i in range(len(data['text'])):
        if data['text'][i].strip():
            block_num = data['block_num'][i]
            blocks[block_num].append({
                'text': data['text'][i],
                'x': data['left'][i],
                'y': data['top'][i],
                'width': data['width'][i],
                'height': data['height'][i],
                'conf': data['conf'][i],
                'line_num': data['line_num'][i]
            })
    return blocks

def find_input_fields(blocks, template_fields):
    """หาตำแหน่งที่น่าจะเป็น input field โดยเทียบกับ template"""
    field_positions = {}
    
    # แปลง template fields เป็น list ของ path
    def get_field_paths(obj, prefix=''):
        paths = []
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_prefix = f"{prefix}.{key}" if prefix else key
                if isinstance(value, (dict, list)):
                    paths.extend(get_field_paths(value, new_prefix))
                else:
                    paths.append(new_prefix)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                new_prefix = f"{prefix}[{i}]"
                paths.extend(get_field_paths(item, new_prefix))
        return paths

    template_paths = get_field_paths(template_fields)
    
    # หาข้อความที่เกี่ยวข้องกับแต่ละ field
    for field_path in template_paths:
        field_name = field_path.split('.')[-1]
        
        # หาข้อความที่เกี่ยวข้องใน OCR blocks
        for block_num, block_items in blocks.items():
            for item in block_items:
                # ถ้าเจอข้อความที่เกี่ยวข้องกับ field
                if field_name.lower() in item['text'].lower() or \
                   any(thai_field_name in item['text'] for thai_field_name in get_thai_field_names(field_name)):
                    
                    # หาพื้นที่ว่างด้านขวาหรือด้านล่างที่น่าจะเป็นช่องกรอก
                    input_field = {
                        'x': item['x'] + item['width'] + 10,  # ด้านขวาของข้อความ
                        'y': item['y'],
                        'width': 150,  # ความกว้างประมาณของช่องกรอก
                        'height': item['height'],
                        'page': 0,
                        'related_text': item['text'],
                        'confidence': item['conf']
                    }
                    
                    field_positions[field_path] = input_field
                    break
    
    return field_positions

def get_thai_field_names(field_name):
    """แปลง field name เป็นคำไทยที่อาจพบในฟอร์ม"""
    thai_mappings = {
        'name': ['ชื่อ', 'นาม'],
        'address': ['ที่อยู่', 'ที่ตั้ง'],
        'phone': ['โทรศัพท์', 'โทร'],
        'email': ['อีเมล', 'อีเมล์'],
        'nationality': ['สัญชาติ'],
        'passport': ['หนังสือเดินทาง', 'พาสปอร์ต'],
        'date': ['วันที่'],
        'number': ['เลขที่', 'หมายเลข'],
        'type': ['ประเภท'],
        'position': ['ตำแหน่ง'],
        'company': ['บริษัท', 'นิติบุคคล'],
        'registration': ['ทะเบียน', 'จดทะเบียน'],
        'capital': ['ทุน'],
        'moo': ['หมู่', 'หมู่ที่'],
        'tambon': ['ตำบล', 'แขวง'],
        'amphoe': ['อำเภอ', 'เขต'],
        'province': ['จังหวัด'],
        'postal_code': ['รหัสไปรษณีย์'],
        'fax': ['แฟกซ์', 'โทรสาร'],
        'website': ['เว็บไซต์'],
        'business': ['ธุรกิจ', 'กิจการ'],
        'employees': ['ลูกจ้าง', 'พนักงาน'],
        'foreign': ['ต่างด้าว', 'ต่างชาติ'],
        'gender': ['เพศ'],
        'visa': ['วีซ่า'],
        'work_permit': ['ใบอนุญาตทำงาน'],
        'salary': ['เงินเดือน', 'ค่าจ้าง'],
        'benefits': ['สวัสดิการ', 'ผลประโยชน์'],
        'submission': ['ยื่นคำขอ'],
        'reference': ['อ้างอิง'],
        'attachments': ['เอกสารแนบ'],
        # เพิ่มคำแปลอื่นๆ ตามที่พบในฟอร์ม
    }
    
    words = field_name.lower().split('_')
    thai_words = []
    for word in words:
        if word in thai_mappings:
            thai_words.extend(thai_mappings[word])
    return thai_words

def analyze_form_and_compare():
    # แปลง PDF เป็นภาพ
    pages = convert_from_path('บต.44.pdf')
    page = pages[0]
    
    # อ่าน template
    with open('bt44_template.json', 'r', encoding='utf-8') as f:
        template = json.load(f)
    
    # วิเคราะห์ layout จาก OCR
    blocks = extract_text_with_layout(page)
    
    # ตรวจจับเส้นประ
    dotted_fields = detect_dotted_lines(page)
    
    # รวบรวม field paths จาก template
    def get_field_paths(obj, prefix=''):
        paths = []
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_prefix = f"{prefix}.{key}" if prefix else key
                if isinstance(value, (dict, list)):
                    paths.extend(get_field_paths(value, new_prefix))
                else:
                    paths.append(new_prefix)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                new_prefix = f"{prefix}[{i}]"
                paths.extend(get_field_paths(item, new_prefix))
        return paths
    
    template_paths = get_field_paths(template)
    
    # หา field positions จาก OCR และ dotted lines
    field_positions = {}
    found_fields = set()
    
    # 1. ค้นหาจาก OCR
    for field_path in template_paths:
        field_name = field_path.split('.')[-1]
        
        for block_num, block_items in blocks.items():
            for item in block_items:
                if field_name.lower() in item['text'].lower() or \
                   any(thai_name in item['text'] for thai_name in get_thai_field_names(field_name)):
                    
                    # หาเส้นประที่อยู่ใกล้ที่สุด
                    nearest_dotted = None
                    min_distance = float('inf')
                    
                    for dotted in dotted_fields:
                        # คำนวณระยะห่างระหว่างข้อความกับเส้นประ
                        dx = dotted['x'] - (item['x'] + item['width'])
                        dy = abs(dotted['y'] - item['y'])
                        distance = (dx ** 2 + dy ** 2) ** 0.5
                        
                        if dx > 0 and distance < min_distance:  # เส้นประต้องอยู่ทางขวาของข้อความ
                            min_distance = distance
                            nearest_dotted = dotted
                    
                    if nearest_dotted:
                        field_positions[field_path] = {
                            'x': nearest_dotted['x'],
                            'y': nearest_dotted['y'],
                            'width': nearest_dotted['width'],
                            'height': nearest_dotted['height'],
                            'page': 0,
                            'related_text': item['text'],
                            'confidence': item['conf'],
                            'source': 'dotted_line'
                        }
                    else:
                        # ถ้าไม่พบเส้นประ ใช้พื้นที่ว่างด้านขวาของข้อความ
                        field_positions[field_path] = {
                            'x': item['x'] + item['width'] + 10,
                            'y': item['y'],
                            'width': 150,
                            'height': item['height'],
                            'page': 0,
                            'related_text': item['text'],
                            'confidence': item['conf'],
                            'source': 'ocr'
                        }
                    
                    found_fields.add(field_path)
                    break
    
    # หา fields ที่ขาดหาย
    missing_fields = set(template_paths) - found_fields
    
    # บันทึกผลการวิเคราะห์
    analysis_result = {
        'field_positions': field_positions,
        'missing_fields': list(missing_fields),
        'ocr_blocks': {str(k): v for k, v in blocks.items()},
        'dotted_fields': dotted_fields
    }
    
    with open('bt44_layout_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(analysis_result, f, ensure_ascii=False, indent=2)
    
    print(f"พบ {len(found_fields)} fields ที่ตรงกับ template")
    print(f"ไม่พบ {len(missing_fields)} fields:")
    for field in sorted(missing_fields):
        print(f"- {field}")
    print("\nบันทึกผลการวิเคราะห์ใน bt44_layout_analysis.json แล้ว")

if __name__ == "__main__":
    analyze_form_and_compare()
