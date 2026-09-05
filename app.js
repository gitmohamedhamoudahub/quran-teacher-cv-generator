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
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Escape HTML then convert newlines to <br> (for textarea content)
 * @param {string} str - String to convert
 * @returns {string} HTML-safe string with line breaks
 */
function nl2br(str) {
    return escapeHtml(str).replace(/\n/g, '<br>');
}

/**
 * Build the printable CV template (used only for PDF rendering)
 * @param {Object} data - Form data
 * @returns {string} HTML markup for the CV page
 */
function buildPreviewHtml(data) {
    const qualParts = [];
    if (data.academicQualification) qualParts.push(`<p><strong>المؤهل العلمي:</strong> ${escapeHtml(data.academicQualification)}</p>`);
    if (data.institution) qualParts.push(`<p>${escapeHtml(data.institution)}${data.qualYear ? ' (' + escapeHtml(data.qualYear) + ')' : ''}</p>`);
    if (data.quranicIjaza) qualParts.push(`<p><strong>الإجازات القرآنية والأسانيد:</strong></p><p>${nl2br(data.quranicIjaza)}</p>`);
    if (data.additionalCertificates) qualParts.push(`<p><strong>الدورات والشهادات التخصصية:</strong></p><p>${nl2br(data.additionalCertificates)}</p>`);

    const expParts = [];
    if (data.positionName) expParts.push(`<p><strong>المنصب:</strong> ${escapeHtml(data.positionName)}</p>`);
    if (data.workPlace) expParts.push(`<p>${escapeHtml(data.workPlace)}</p>`);
    if (data.workFromYear || data.workToYear) expParts.push(`<p><strong>الفترة:</strong> ${escapeHtml(data.workFromYear) || 'من'} – ${escapeHtml(data.workToYear) || 'إلى'}</p>`);
    if (data.jobResponsibilities) expParts.push(`<p><strong>المسؤوليات والإنجازات:</strong></p><p>${nl2br(data.jobResponsibilities)}</p>`);
    if (data.numStudents) expParts.push(`<p><strong>عدد الطلاب المدرسين:</strong> ${escapeHtml(data.numStudents)}</p>`);
    if (data.targetAges) expParts.push(`<p><strong>الفئات العمرية المستهدفة:</strong> ${escapeHtml(data.targetAges)}</p>`);

    const teachParts = [];
    if (data.platforms) teachParts.push(`<p><strong>المنصات المستخدمة:</strong> ${escapeHtml(data.platforms)}</p>`);
    if (data.lessonDuration) teachParts.push(`<p><strong>مدة الحصة:</strong> ${escapeHtml(data.lessonDuration)} دقيقة</p>`);
    if (data.lessonsPerWeek) teachParts.push(`<p><strong>عدد الحصص أسبوعياً:</strong> ${escapeHtml(data.lessonsPerWeek)}</p>`);
    if (data.teachingDays) teachParts.push(`<p><strong>أيام التدريس:</strong> ${escapeHtml(data.teachingDays)}</p>`);
    if (data.teachingMethod) teachParts.push(`<p><strong>منهجية التدريس:</strong></p><p>${nl2br(data.teachingMethod)}</p>`);
    if (data.achievements) teachParts.push(`<p><strong>الإنجازات والأنشطة البارزة:</strong></p><p>${nl2br(data.achievements)}</p>`);

    return `
    <div class="cv-page">
        <div class="cv-header">
            <div class="cv-name">${escapeHtml(data.fullName)}</div>
            ${data.jobTitle ? `<div class="cv-title">${escapeHtml(data.jobTitle)}</div>` : ''}
            <div class="cv-contact">
                ${data.location ? `<span>📍 ${escapeHtml(data.location)}</span>` : ''}
                ${data.phone ? `<span>📞 ${escapeHtml(data.phone)}</span>` : ''}
                ${data.email ? `<span>✉️ ${escapeHtml(data.email)}</span>` : ''}
                ${data.languages ? `<span>🌐 ${escapeHtml(data.languages)}</span>` : ''}
            </div>
        </div>

        ${data.biography ? `
        <div class="cv-section">
            <div class="cv-section-title">📝 النبذة المهنية</div>
            <div class="cv-section-content"><p>${nl2br(data.biography)}</p></div>
        </div>` : ''}

        ${qualParts.length ? `
        <div class="cv-section">
            <div class="cv-section-title">🎓 المؤهلات العلمية والإجازات القرآنية</div>
            <div class="cv-section-content">${qualParts.join('')}</div>
        </div>` : ''}

        ${expParts.length ? `
        <div class="cv-section">
            <div class="cv-section-title">💼 الخبرة في تعليم وتحفيظ القرآن الكريم</div>
            <div class="cv-section-content">${expParts.join('')}</div>
        </div>` : ''}

        ${teachParts.length ? `
        <div class="cv-section">
            <div class="cv-section-title">💻 أسلوب التدريس أونلاين</div>
            <div class="cv-section-content">${teachParts.join('')}</div>
        </div>` : ''}
    </div>`;
}

/**
 * Generate a PDF export of the CV with correctly shaped Arabic text.
 * Renders a styled off-screen HTML template to a high-res canvas
 * (html2canvas), then places that image into a jsPDF document,
 * splitting across multiple A4 pages if the content is tall.
 */
async function generatePDF() {
    const formData = new FormData(document.getElementById('cvForm'));
    const data = Object.fromEntries(formData);

    if (!data.fullName || !data.location || !data.email || !data.phone) {
        showStatus('⚠️ الرجاء ملء جميع الحقول المطلوبة (مشار إليها بـ *)', 'error');
        return;
    }

    const pdfBtn = document.querySelector('.btn-pdf');
    pdfBtn.disabled = true;
    showStatus('⏳ جاري تجهيز ملف PDF...', 'success');

    const preview = document.getElementById('cvPreview');
    preview.innerHTML = buildPreviewHtml(data);

    try {
        // Give the browser a tick to finish layout before capturing
        await new Promise(resolve => setTimeout(resolve, 50));

        const canvas = await html2canvas(preview.firstElementChild, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`السيرة_الذاتية_${data.fullName}.pdf`);
        showStatus('تم تنزيل السيرة الذاتية PDF بنجاح! 📥', 'success');
    } catch (error) {
        console.error('Error:', error);
        showStatus('حدث خطأ أثناء توليد PDF. الرجاء المحاولة مرة أخرى.', 'error');
    } finally {
        preview.innerHTML = '';
        pdfBtn.disabled = false;
    }
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
    const sectionBreak = `<w:p><w:pPr><w:spacing w:after="200"/></w:pPr></w:p>`;
    const sectionTitle = (text) => `<w:p><w:r><w:rPr><w:b/><w:sz w:val="48"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`;
    const multiline = (str) => escapeXml(str).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>');

    // البيانات الشخصية
    const personalLines = [];
    personalLines.push(`<w:p><w:r><w:t>▪ الاسم الكامل: ${escapeXml(data.fullName)}</w:t></w:r></w:p>`);
    if (data.jobTitle) personalLines.push(`<w:p><w:r><w:t>▪ المسمى المهني: ${escapeXml(data.jobTitle)}</w:t></w:r></w:p>`);
    if (data.location) personalLines.push(`<w:p><w:r><w:t>▪ مكان الإقامة: ${escapeXml(data.location)}</w:t></w:r></w:p>`);
    if (data.yearsExp) personalLines.push(`<w:p><w:r><w:t>▪ سنوات الخبرة: ${escapeXml(data.yearsExp)} سنة</w:t></w:r></w:p>`);
    if (data.phone) personalLines.push(`<w:p><w:r><w:t>▪ الهاتف / واتساب: ${escapeXml(data.phone)}</w:t></w:r></w:p>`);
    if (data.email) personalLines.push(`<w:p><w:r><w:t>▪ البريد الإلكتروني: ${escapeXml(data.email)}</w:t></w:r></w:p>`);
    if (data.languages) personalLines.push(`<w:p><w:r><w:t>▪ اللغات: ${escapeXml(data.languages)}</w:t></w:r></w:p>`);

    // المؤهلات والإجازات
    const qualLines = [];
    if (data.academicQualification) qualLines.push(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>المؤهل العلمي: ${escapeXml(data.academicQualification)}</w:t></w:r></w:p>`);
    if (data.institution) qualLines.push(`<w:p><w:r><w:t>${escapeXml(data.institution)}${data.qualYear ? ' (' + escapeXml(data.qualYear) + ')' : ''}</w:t></w:r></w:p>`);
    if (data.quranicIjaza) qualLines.push(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>الإجازات القرآنية والأسانيد:</w:t></w:r></w:p><w:p><w:r><w:t>${multiline(data.quranicIjaza)}</w:t></w:r></w:p>`);
    if (data.additionalCertificates) qualLines.push(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>الدورات والشهادات التخصصية:</w:t></w:r></w:p><w:p><w:r><w:t>${multiline(data.additionalCertificates)}</w:t></w:r></w:p>`);

    // الخبرة العملية
    const expLines = [];
    if (data.positionName) expLines.push(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>المنصب: ${escapeXml(data.positionName)}</w:t></w:r></w:p>`);
    if (data.workPlace) expLines.push(`<w:p><w:r><w:t>${escapeXml(data.workPlace)}</w:t></w:r></w:p>`);
    if (data.workFromYear || data.workToYear) expLines.push(`<w:p><w:r><w:t>الفترة: ${escapeXml(data.workFromYear) || 'من'} – ${escapeXml(data.workToYear) || 'إلى'}</w:t></w:r></w:p>`);
    if (data.jobResponsibilities) expLines.push(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>المسؤوليات والإنجازات:</w:t></w:r></w:p><w:p><w:r><w:t>${multiline(data.jobResponsibilities)}</w:t></w:r></w:p>`);
    if (data.numStudents) expLines.push(`<w:p><w:r><w:t>عدد الطلاب المدرسين: ${escapeXml(data.numStudents)}</w:t></w:r></w:p>`);
    if (data.targetAges) expLines.push(`<w:p><w:r><w:t>الفئات العمرية المستهدفة: ${escapeXml(data.targetAges)}</w:t></w:r></w:p>`);

    // أسلوب التدريس
    const teachLines = [];
    if (data.platforms) teachLines.push(`<w:p><w:r><w:t>المنصات المستخدمة: ${escapeXml(data.platforms)}</w:t></w:r></w:p>`);
    if (data.lessonDuration) teachLines.push(`<w:p><w:r><w:t>مدة الحصة: ${escapeXml(data.lessonDuration)} دقيقة</w:t></w:r></w:p>`);
    if (data.lessonsPerWeek) teachLines.push(`<w:p><w:r><w:t>عدد الحصص أسبوعياً: ${escapeXml(data.lessonsPerWeek)}</w:t></w:r></w:p>`);
    if (data.teachingDays) teachLines.push(`<w:p><w:r><w:t>أيام التدريس: ${escapeXml(data.teachingDays)}</w:t></w:r></w:p>`);
    if (data.teachingMethod) teachLines.push(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>منهجية التدريس:</w:t></w:r></w:p><w:p><w:r><w:t>${multiline(data.teachingMethod)}</w:t></w:r></w:p>`);
    if (data.achievements) teachLines.push(`<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>الإنجازات والأنشطة البارزة:</w:t></w:r></w:p><w:p><w:r><w:t>${multiline(data.achievements)}</w:t></w:r></w:p>`);

    // معلومات التواصل (تكرار مختصر في نهاية المستند)
    const contactLines = [`<w:p><w:r><w:t>الاسم: ${escapeXml(data.fullName)}</w:t></w:r></w:p>`];
    if (data.phone) contactLines.push(`<w:p><w:r><w:t>واتساب / هاتف: ${escapeXml(data.phone)}</w:t></w:r></w:p>`);
    if (data.email) contactLines.push(`<w:p><w:r><w:t>البريد الإلكتروني: ${escapeXml(data.email)}</w:t></w:r></w:p>`);

    const sections = [];
    if (personalLines.length) sections.push(sectionTitle('👤 البيانات الشخصية') + personalLines.join(''));
    if (data.biography) sections.push(sectionTitle('📝 النبذة المهنية') + `<w:p><w:r><w:t>${multiline(data.biography)}</w:t></w:r></w:p>`);
    if (qualLines.length) sections.push(sectionTitle('🎓 المؤهلات العلمية والإجازات القرآنية') + qualLines.join(''));
    if (expLines.length) sections.push(sectionTitle('💼 الخبرة في تعليم وتحفيظ القرآن الكريم') + expLines.join(''));
    if (teachLines.length) sections.push(sectionTitle('💻 أسلوب التدريس أونلاين') + teachLines.join(''));
    sections.push(sectionTitle('📞 معلومات التواصل') + contactLines.join(''));

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="56"/></w:rPr><w:t>السيرة الذاتية المهنية</w:t></w:r></w:p>
${data.jobTitle ? `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:i/><w:sz w:val="44"/></w:rPr><w:t>${escapeXml(data.jobTitle)}</w:t></w:r></w:p>` : ''}
${sectionBreak}
${sections.join(sectionBreak)}
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