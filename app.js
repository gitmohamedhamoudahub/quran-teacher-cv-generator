// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadData();
});

/**
 * Switch between tabs
 * @param {Event} event - Click event from tab button
 * @param {string} tabName - Name of tab to show
 */
function switchTab(event, tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

/**
 * Save form data to localStorage
 */
function saveData() {
    const formData = new FormData(document.getElementById('cvForm'));
    const data = Object.fromEntries(formData);

    localStorage.setItem('cvData', JSON.stringify(data));
    showStatus('تم حفظ البيانات بنجاح! ✅', 'success');
}

/**
 * Load form data from localStorage
 */
function loadData() {
    const saved = localStorage.getItem('cvData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const field = document.getElementById(key);
            if (field) {
                field.value = data[key];
            }
        });
    }
}

/**
 * Reset form and clear localStorage
 */
function resetForm() {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
        localStorage.removeItem('cvData');
        document.getElementById('cvForm').reset();
        showStatus('تم حذف البيانات بنجاح! 🗑️', 'success');
    }
}

/**
 * Show status message
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = 'status-message ' + type;
    
    setTimeout(() => {
        statusEl.style.display = 'none';
    }, 4000);
}

/**
 * Escape XML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Generate Word document from form data
 */
function generateDocument() {
    const formData = new FormData(document.getElementById('cvForm'));
    const data = Object.fromEntries(formData);

    // Validate required fields
    if (!data.fullName || !data.location || !data.email || !data.phone) {
        showStatus('⚠️ الرجاء ملء جميع الحقول المطلوبة (مشار إليها بـ *)', 'error');
        return;
    }

    try {
        // Create Word document XML content
        const wordContent = createWordXml(data);
        const rels = createRels();
        const docRels = createDocRels();
        const contentTypes = createContentTypes();

        // Create ZIP file
        const zip = new JSZip();
        zip.file('[Content_Types].xml', contentTypes);
        zip.folder('_rels').file('.rels', rels);
        zip.folder('word').file('document.xml', wordContent);
        zip.folder('word').folder('_rels').file('document.xml.rels', docRels);

        zip.generateAsync({ type: 'blob' }).then(blob => {
            saveAs(blob, `السيرة_الذاتية_${data.fullName}.docx`);
            showStatus('تم تنزيل السيرة الذاتية بنجاح! 📥', 'success');
        }).catch(err => {
            console.error('Error:', err);
            showStatus('حدث خطأ أثناء توليد المستند.', 'error');
        });
    } catch (error) {
        console.error('Error:', error);
        showStatus('حدث خطأ أثناء توليد المستند. الرجاء المحاولة مرة أخرى.', 'error');
    }
}

/**
 * Create Word document XML structure
 * @param {Object} data - Form data
 * @returns {string} Word XML content
 */
function createWordXml(data) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" 
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="56"/></w:rPr><w:t>السيرة الذاتية المهنية</w:t></w:r></w:p>
<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val="44"/></w:rPr><w:t>${escapeXml(data.jobTitle)}</w:t></w:r></w:p>
<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>
<w:p><w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>👤 البيانات الشخصية</w:t></w:r></w:p>
<w:p><w:r><w:t>▪ الاسم الكامل: ${escapeXml(data.fullName)}</w:t></w:r></w:p>
<w:p><w:r><w:t>▪ المسمى المهني: ${escapeXml(data.jobTitle)}</w:t></w:r></w:p>
<w:p><w:r><w:t>▪ مكان الإقامة: ${escapeXml(data.location)}</w:t></w:r></w:p>
<w:p><w:r><w:t>▪ سنوات الخبرة: ${data.yearsExp} سنة</w:t></w:r></w:p>
<w:p><w:r><w:t>▪ الهاتف / واتساب: ${escapeXml(data.phone)}</w:t></w:r></w:p>
<w:p><w:r><w:t>▪ البريد الإلكتروني: ${escapeXml(data.email)}</w:t></w:r></w:p>
<w:p><w:r><w:t>▪ اللغات: ${escapeXml(data.languages)}</w:t></w:r></w:p>
<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>
${data.biography ? `<w:p><w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>📝 النبذة المهنية</w:t></w:r></w:p>
<w:p><w:r><w:t>${escapeXml(data.biography).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t></w:r></w:p>
<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>` : ''}
<w:p><w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>🎓 المؤهلات العلمية والإجازات القرآنية</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>المؤهل العلمي: ${escapeXml(data.academicQualification)}</w:t></w:r></w:p>
${data.institution ? `<w:p><w:r><w:t>${escapeXml(data.institution)}${data.qualYear ? ' (' + data.qualYear + ')' : ''}</w:t></w:r></w:p>` : ''}
<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>الإجازات القرآنية والأسانيد:</w:t></w:r></w:p>
<w:p><w:r><w:t>${escapeXml(data.quranicIjaza).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t></w:r></w:p>
${data.additionalCertificates ? `<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>الدورات والشهادات التخصصية:</w:t></w:r></w:p>
<w:p><w:r><w:t>${escapeXml(data.additionalCertificates).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t></w:r></w:p>` : ''}
<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>
<w:p><w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>💼 الخبرة في تعليم وتحفيظ القرآن الكريم</w:t></w:r></w:p>
<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>المنصب: ${escapeXml(data.positionName)}</w:t></w:r></w:p>
${data.workPlace ? `<w:p><w:r><w:t>${escapeXml(data.workPlace)}</w:t></w:r></w:p>` : ''}
${data.workFromYear || data.workToYear ? `<w:p><w:r><w:t>الفترة: ${data.workFromYear || 'من'} – ${data.workToYear || 'إلى'}</w:t></w:r></w:p>` : ''}
<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>المسؤوليات والإنجازات:</w:t></w:r></w:p>
<w:p><w:r><w:t>${escapeXml(data.jobResponsibilities).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t></w:r></w:p>
${data.numStudents ? `<w:p><w:r><w:t>عدد الطلاب المدرسين: ${data.numStudents}</w:t></w:r></w:p>` : ''}
<w:p><w:r><w:t>الفئات العمرية المستهدفة: ${escapeXml(data.targetAges)}</w:t></w:r></w:p>
<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>
<w:p><w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>💻 أسلوب التدريس أونلاين</w:t></w:r></w:p>
<w:p><w:r><w:t>المنصات المستخدمة: ${escapeXml(data.platforms)}</w:t></w:r></w:p>
${data.lessonDuration ? `<w:p><w:r><w:t>مدة الحصة: ${data.lessonDuration} دقيقة</w:t></w:r></w:p>` : ''}
${data.lessonsPerWeek ? `<w:p><w:r><w:t>عدد الحصص أسبوعياً: ${data.lessonsPerWeek}</w:t></w:r></w:p>` : ''}
${data.teachingDays ? `<w:p><w:r><w:t>أيام التدريس: ${escapeXml(data.teachingDays)}</w:t></w:r></w:p>` : ''}
<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>منهجية التدريس:</w:t></w:r></w:p>
<w:p><w:r><w:t>${escapeXml(data.teachingMethod).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t></w:r></w:p>
${data.achievements ? `<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>الإنجازات والأنشطة البارزة:</w:t></w:r></w:p>
<w:p><w:r><w:t>${escapeXml(data.achievements).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>')}</w:t></w:r></w:p>` : ''}
<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>
<w:p><w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>📞 معلومات التواصل</w:t></w:r></w:p>
<w:p><w:r><w:t>الاسم: ${escapeXml(data.fullName)}</w:t></w:r></w:p>
<w:p><w:r><w:t>واتساب / هاتف: ${escapeXml(data.phone)}</w:t></w:r></w:p>
<w:p><w:r><w:t>البريد الإلكتروني: ${escapeXml(data.email)}</w:t></w:r></w:p>
</w:body>
</w:document>`;
}

/**
 * Create relationships XML
 * @returns {string} Relationships XML
 */
function createRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
}

/**
 * Create document relationships
 * @returns {string} Document relationships XML
 */
function createDocRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
}

/**
 * Create content types
 * @returns {string} Content types XML
 */
function createContentTypes() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
}