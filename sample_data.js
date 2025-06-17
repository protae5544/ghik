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
    },
    bt46: {
        request_type: {
            change_type: ["เปลี่ยนตำแหน่งงาน"],
            details: "ขอเปลี่ยนตำแหน่งจากพนักงานฝ่ายผลิตเป็นหัวหน้างาน"
        },
        employer: {
            type: "นิติบุคคล",
            company_info: {
                name_th: "บริษัท รุ่งเรืองกิจ จำกัด",
                name_en: "RUNGRUENGKIT CO., LTD.",
                registration_no: "0123456789012",
                tax_id: "1234567890123"
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
                email: "contact@rungruengkit.co.th"
            },
            business_info: {
                type: "การผลิตอาหาร",
                products: "อาหารแปรรูป",
                registered_capital: "1000000",
                working_capital: "1000000",
                total_employees: { thai: 50, foreign: 10 }
            }
        },
        work_change_details: {
            current: {
                work_type: "ฝ่ายผลิต",
                position: "พนักงาน",
                job_description: "ควบคุมเครื่องจักร",
                workplace: {
                    address_no: "99/99",
                    moo: "5",
                    soi: "สุขุมวิท 50",
                    road: "สุขุมวิท",
                    tambon: "คลองเตย",
                    amphoe: "คลองเตย",
                    province: "กรุงเทพมหานคร",
                    postal_code: "10110"
                },
                salary: 15000,
                conditions: ["ทำงานประจำ"]
            },
            requested: {
                work_type: "ฝ่ายผลิต",
                position: "หัวหน้างาน",
                job_description: "ควบคุมและตรวจสอบงานผลิต",
                workplace: {
                    address_no: "99/99",
                    moo: "5",
                    soi: "สุขุมวิท 50",
                    road: "สุขุมวิท",
                    tambon: "คลองเตย",
                    amphoe: "คลองเตย",
                    province: "กรุงเทพมหานคร",
                    postal_code: "10110"
                },
                salary: 18000,
                conditions: ["ทำงานประจำ"]
            }
        },
        document_info: {
            submission_date: "2023-02-01",
            reference_no: "REF20230201_001",
            attachments: ["สำเนาบัตรประชาชน"]
        }
    },
    bt52: {
        employer: {
            type: "นิติบุคคล",
            company_info: {
                name_th: "บริษัท รุ่งเรืองกิจ จำกัด",
                name_en: "RUNGRUENGKIT CO., LTD.",
                registration_no: "0123456789012",
                tax_id: "1234567890123"
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
                email: "contact@rungruengkit.co.th"
            }
        },
        employee: {
            personal_info: {
                title: "Mr.",
                firstname: "JOHN",
                lastname: "DOE",
                nationality: "MYANMAR",
                birth_date: "1990-01-01",
                gender: "ชาย",
                current_address: {
                    address_no: "99/99",
                    moo: "5",
                    soi: "สุขุมวิท 50",
                    road: "สุขุมวิท",
                    tambon: "คลองเตย",
                    amphoe: "คลองเตย",
                    province: "กรุงเทพมหานคร",
                    postal_code: "10110"
                }
            },
            work_permit: {
                current_no: "W123456",
                issue_date: "2023-01-01",
                expire_date: "2024-01-01",
                extension_period: {
                    start_date: "2024-01-02",
                    end_date: "2025-01-01"
                }
            },
            job_info: {
                position: "พนักงานฝ่ายผลิต",
                job_description: "ควบคุมเครื่องจักรในสายการผลิต",
                salary: 15000
            }
        },
        document_info: {
            submission_date: "2023-03-01",
            reference_no: "REF20230301_001",
            attachments: ["สำเนาใบอนุญาต"]
        }
    },
    bt55: {
        employer: {
            type: "นิติบุคคล",
            company_info: {
                name_th: "บริษัท รุ่งเรืองกิจ จำกัด",
                name_en: "RUNGRUENGKIT CO., LTD.",
                registration_no: "0123456789012"
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
                phone: "02-123-4567"
            }
        },
        employee: {
            personal_info: {
                title: "Mr.",
                firstname: "JOHN",
                lastname: "DOE",
                nationality: "MYANMAR",
                passport_no: "MB123456"
            },
            work_permit: {
                no: "W123456",
                issue_date: "2023-01-01",
                expire_date: "2024-01-01"
            },
            termination_info: {
                last_working_date: "2023-12-31",
                reason: "ครบสัญญาจ้าง",
                details: "สัญญาจ้างครบกำหนดและไม่ประสงค์ต่อสัญญา"
            }
        },
        document_info: {
            submission_date: "2023-04-01",
            reference_no: "REF20230401_001",
            attachments: ["ใบลาออก"]
        }
    },
    contract: {
        contract_info: {
            contract_no: "EMP2023001",
            date: "2023-01-01",
            location: "กรุงเทพมหานคร"
        },
        employer: {
            company_info: {
                name_th: "บริษัท รุ่งเรืองกิจ จำกัด",
                name_en: "RUNGRUENGKIT CO., LTD.",
                type: "นิติบุคคล",
                registration_no: "0123456789012",
                address: {
                    address_no: "99/99",
                    moo: "5",
                    soi: "สุขุมวิท 50",
                    road: "สุขุมวิท",
                    tambon: "คลองเตย",
                    amphoe: "คลองเตย",
                    province: "กรุงเทพมหานคร",
                    postal_code: "10110"
                }
            },
            representative: {
                title: "นาย",
                position: "กรรมการผู้จัดการ",
                authority_document: "หนังสือรับรองบริษัท"
            }
        },
        employment_terms: {
            position: "พนักงานฝ่ายผลิต",
            job_description: "ควบคุมเครื่องจักรในสายการผลิต",
            period: {
                start_date: "2023-01-01",
                end_date: "2024-01-01",
                probation_period: 119
            },
            working_hours: {
                regular: {
                    start: "08:00",
                    end: "17:00",
                    days_per_week: 6,
                    hours_per_day: 8
                },
                break_time: {
                    start: "12:00",
                    end: "13:00"
                }
            },
            compensation: {
                salary: {
                    amount: 15000,
                    payment_period: "รายเดือน",
                    payment_date: "ทุกวันที่ 5 ของเดือน"
                },
                overtime: {
                    rate: 1.5,
                    conditions: "คำนวณตามกฎหมายแรงงาน"
                },
                holiday_work: {
                    rate: 2,
                    conditions: "คำนวณตามกฎหมายแรงงาน"
                },
                other_benefits: ["ค่าอาหาร", "ค่าที่พัก", "ประกันสุขภาพ"]
            },
            leave_policy: {
                annual_leave: {
                    days: 6,
                    conditions: "หลังผ่านทดลองงาน"
                },
                sick_leave: {
                    days: 30,
                    conditions: "ต้องมีใบรับรองแพทย์กรณีลาเกิน 3 วัน"
                },
                other_leaves: ["ลากิจ 3 วัน", "ลาคลอด 98 วัน"]
            },
            welfare_benefits: {
                social_security: true,
                workmen_compensation: true,
                health_insurance: {
                    provided: true,
                    details: "ประกันสุขภาพกลุ่ม วงเงิน 100,000 บาท"
                },
                accommodation: {
                    provided: true,
                    details: "หอพักพนักงาน พร้อมน้ำไฟ"
                },
                meals: {
                    provided: true,
                    details: "อาหาร 2 มื้อ"
                },
                other_benefits: ["รถรับส่ง", "เครื่องแบบพนักงาน", "โบนัสประจำปี"]
            }
        },
        termination_conditions: {
            notice_period: "30 วัน",
            severance_pay: "ตามกฎหมายแรงงาน",
            other_conditions: "ต้องส่งมอบงานและทรัพย์สินของบริษัทคืนให้ครบถ้วน"
        },
        signatures: {
            employer: {
                date: "2023-01-01",
                witness: "นาย ก"
            },
            employee: {
                date: "2023-01-01",
                witness: "นาย ข"
            }
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

    // โหลดข้อมูล bt46
    const bt46Form = document.getElementById('bt46-form');
    if (bt46Form) {
        Object.entries(sampleData.bt46).forEach(([key, value]) => {
            fillFormSection(bt46Form, key, value);
        });
    }
    // โหลดข้อมูล bt52
    const bt52Form = document.getElementById('bt52-form');
    if (bt52Form) {
        Object.entries(sampleData.bt52).forEach(([key, value]) => {
            fillFormSection(bt52Form, key, value);
        });
    }
    // โหลดข้อมูล bt55
    const bt55Form = document.getElementById('bt55-form');
    if (bt55Form) {
        Object.entries(sampleData.bt55).forEach(([key, value]) => {
            fillFormSection(bt55Form, key, value);
        });
    }
    // โหลดข้อมูล contract
    const contractForm = document.getElementById('contract-form');
    if (contractForm) {
        Object.entries(sampleData.contract).forEach(([key, value]) => {
            fillFormSection(contractForm, key, value);
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
