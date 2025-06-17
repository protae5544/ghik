// ข้อมูลตัวอย่างสำหรับทดสอบระบบ
const sampleData = {
    employer: {
        type: "นิติบุคคล",
        company_info: {
            name_th: "บริษัท รุ่งเรืองกิจ จำกัด",
            name_en: "RUNGRUENGKIT CO., LTD.",
            registration_no: "0123456789012",
            issue_date: "2020-01-15",
            registered_capital: "1000000",
            current_capital: "1000000"
        },
        contact_info: {
            address_no: "99/99",
            moo: "5",
            soi: "สุขุมวิท 50",
            road: "สุขุมวิท",
            tambon: "คลองเตย",
            amphoe: "คลองเตย",
            province: "กรุงเทพมหานคร",
            postal_code: "10110",
            phone: "02-123-4567",
            fax: "02-123-4568",
            email: "contact@rungruengkit.co.th",
            website: "www.rungruengkit.co.th"
        },
        business_info: {
            type: "การผลิตอาหาร",
            products: "อาหารแปรรูป",
            total_employees: {
                thai: 50,
                foreign: 10
            }
        }
    },
    bt44: {
        employee: {
            personal_info: {
                title: "Mr.",
                firstname: "JOHN",
                lastname: "DOE",
                nationality: "MYANMAR",
                birth_date: "1990-01-01",
                gender: "ชาย",
                passport_no: "MB123456",
                passport_issue_date: "2023-01-01",
                passport_expire_date: "2028-01-01",
                visa_no: "V123456",
                visa_issue_date: "2023-01-01",
                visa_expire_date: "2024-01-01"
            },
            work_permit: {
                no: "W123456",
                issue_date: "2023-01-01",
                expire_date: "2024-01-01"
            },
            job_info: {
                position: "พนักงานฝ่ายผลิต",
                job_description: "ควบคุมเครื่องจักรในสายการผลิต",
                work_location: {
                    address_no: "99/99",
                    moo: "5",
                    soi: "สุขุมวิท 50",
                    road: "สุขุมวิท",
                    tambon: "คลองเตย",
                    amphoe: "คลองเตย",
                    province: "กรุงเทพมหานคร",
                    postal_code: "10110"
                },
                contract_period: {
                    start_date: "2023-01-01",
                    end_date: "2024-01-01"
                },
                salary: 15000,
                benefits: ["ที่พัก", "อาหาร", "ประกันสุขภาพ"]
            }
        },
        document_info: {
            submission_date: "2023-01-01",
            reference_no: "REF20230101_001",
            attachments: ["สำเนาหนังสือเดินทาง", "สำเนาวีซ่า", "รูปถ่าย"]
        }
    }
};

// ฟังก์ชันสำหรับโหลดข้อมูลตัวอย่าง
function loadSampleData() {
    // โหลดข้อมูลนายจ้าง
    const employerForm = document.getElementById('employer-form');
    if (employerForm) {
        Object.entries(sampleData.employer).forEach(([key, value]) => {
            fillFormSection(employerForm, key, value);
        });
    }

    // โหลดข้อมูล บต.44
    const bt44Form = document.getElementById('bt44-form');
    if (bt44Form) {
        Object.entries(sampleData.bt44).forEach(([key, value]) => {
            fillFormSection(bt44Form, key, value);
        });
    }
}

// ฟังก์ชันสำหรับกรอกข้อมูลในฟอร์ม
function fillFormSection(form, section, data) {
    if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
            const inputId = `${section}.${key}`;
            const input = form.querySelector(`[name="${inputId}"]`);
            if (input) {
                input.value = value;
            } else if (typeof value === 'object') {
                fillFormSection(form, `${section}.${key}`, value);
            }
        });
    }
}

// เพิ่มปุ่มโหลดข้อมูลตัวอย่าง
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (header) {
        const sampleButton = document.createElement('button');
        sampleButton.textContent = 'โหลดข้อมูลตัวอย่าง';
        sampleButton.className = 'action-button';
        sampleButton.onclick = loadSampleData;
        header.appendChild(sampleButton);
    }
});
