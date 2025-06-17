// PDF field mappings
const PDF_MAPPINGS = {
    'bt44': {
        template: 'บต.44.pdf',
        fields: {
            // ข้อมูลนายจ้าง
            'employer_type': 'employer.type',
            'company_name_th': 'employer.company_info.name_th',
            'company_name_en': 'employer.company_info.name_en',
            'registration_no': 'employer.company_info.registration_no',
            'address_no': 'employer.contact_info.address_no',
            'moo': 'employer.contact_info.moo',
            'soi': 'employer.contact_info.soi',
            'road': 'employer.contact_info.road',
            'tambon': 'employer.contact_info.tambon',
            'amphoe': 'employer.contact_info.amphoe',
            'province': 'employer.contact_info.province',
            'postal_code': 'employer.contact_info.postal_code',
            
            // ข้อมูลลูกจ้าง
            'employee_title': 'employee.personal_info.title',
            'employee_firstname': 'employee.personal_info.firstname',
            'employee_lastname': 'employee.personal_info.lastname',
            'nationality': 'employee.personal_info.nationality',
            'passport_no': 'employee.personal_info.passport_no',
            'work_permit_no': 'employee.work_permit.no'
        }
    },
    'bt46': {
        template: 'บต.46.pdf',
        fields: {
            // เพิ่ม mapping สำหรับ บต.46
        }
    },
    'bt52': {
        template: 'บต.52.pdf',
        fields: {
            // เพิ่ม mapping สำหรับ บต.52
        }
    },
    'bt55': {
        template: 'บต.55.pdf',
        fields: {
            // เพิ่ม mapping สำหรับ บต.55
        }
    }
};
