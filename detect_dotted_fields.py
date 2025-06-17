import cv2
import numpy as np
from pdf2image import convert_from_path
import json

def detect_dotted_lines(image_path):
    # อ่านภาพ
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
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
        # คำนวณพื้นที่และขนาดของ contour
        x, y, w, h = cv2.boundingRect(contour)
        area = cv2.contourArea(contour)
        
        # กรองเฉพาะ contour ที่น่าจะเป็นช่องกรอกข้อมูล
        min_w = 50  # ความกว้างขั้นต่ำของช่องกรอก
        max_w = width * 0.8  # ความกว้างสูงสุด (80% ของความกว้างหน้า)
        min_h = 20  # ความสูงขั้นต่ำ
        max_h = 40  # ความสูงสูงสุด
        
        if min_w < w < max_w and min_h < h < max_h:
            field = {
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "page": 0  # เพิ่ม page number ตามต้องการ
            }
            dotted_fields.append(field)
    
    return dotted_fields

def main():
    # แปลง PDF เป็นภาพ
    pdf_path = "บต.44.pdf"
    pages = convert_from_path(pdf_path)
    
    # บันทึกภาพหน้าแรก
    pages[0].save("page1.png")
    
    # ตรวจจับเส้นประ
    fields = detect_dotted_lines("page1.png")
    
    # อ่าน template เพื่อเตรียม mapping
    with open('bt44_template.json', 'r', encoding='utf-8') as f:
        template = json.load(f)
    
    # สร้าง mapping ระหว่างตำแหน่งที่พบกับชื่อฟิลด์
    field_mapping = {}
    field_names = []  # รวบรวมชื่อฟิลด์จาก template
    
    def collect_field_names(obj, prefix=""):
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_prefix = f"{prefix}.{key}" if prefix else key
                if isinstance(value, (dict, list)):
                    collect_field_names(value, new_prefix)
                else:
                    field_names.append(new_prefix)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                new_prefix = f"{prefix}[{i}]"
                collect_field_names(item, new_prefix)
    
    collect_field_names(template)
    
    # จับคู่ field ที่พบกับชื่อฟิลด์ตามตำแหน่ง
    for i, field in enumerate(fields):
        if i < len(field_names):
            field_mapping[field_names[i]] = {
                "x": field["x"],
                "y": field["y"],
                "width": field["width"],
                "height": field["height"],
                "page": field["page"],
                "fontSize": 12  # default font size
            }
    
    # บันทึก mapping ลงไฟล์
    with open('bt44_field_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(field_mapping, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
