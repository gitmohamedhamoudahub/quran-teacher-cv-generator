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

/* =========================================================
   Repeatable list rows: work experience / ijazas / courses
   ========================================================= */

/**
 * Update the "خبرة عمل N" / "إجازة N" ... labels after add/remove
 */
function renumberItems(listId, labelPrefix) {
    document.querySelectorAll('#' + listId + ' .repeat-item').forEach((item, idx) => {
        const label = item.querySelector('.repeat-item-label');
        if (label) label.textContent = `${labelPrefix} ${idx + 1}`;
    });
}

/**
 * Add one "work experience" entry row
 * @param {Object} values - Optional initial values to fill the row with
 */
function addExperienceRow(values = {}) {
    const list = document.getElementById('experienceList');
    const item = document.createElement('div');
    item.className = 'repeat-item';
    item.innerHTML = `
        <div class="repeat-item-header">
            <span class="repeat-item-label">خبرة عمل</span>
            <button type="button" class="btn-remove-row" title="حذف">✕</button>
        </div>
        <div class="form-group">
            <div>
                <label>المنصب / المركز</label>
                <input type="text" class="exp-position" placeholder="محفظ قرآن كريم">
            </div>
            <div>
                <label>اسم المركز / الأكاديمية / التدريس الخاص</label>
                <input type="text" class="exp-workplace">
            </div>
        </div>
        <div class="form-group">
            <div>
                <label>من سنة</label>
                <input type="number" class="exp-from" min="1990" max="2100">
            </div>
            <div>
                <label>إلى سنة / حالياً</label>
                <input type="text" class="exp-to" placeholder="حتى الآن">
            </div>
        </div>
        <div class="form-group full">
            <label>المسؤوليات والإنجازات</label>
            <textarea class="exp-resp" placeholder="اكتب المهام والإنجازات الرئيسية"></textarea>
        </div>
    `;
    item.querySelector('.exp-position').value = values.positionName || '';
    item.querySelector('.exp-workplace').value = values.workPlace || '';
    item.querySelector('.exp-from').value = values.workFromYear || '';
    item.querySelector('.exp-to').value = values.workToYear || '';
    item.querySelector('.exp-resp').value = values.jobResponsibilities || '';
    item.querySelector('.btn-remove-row').onclick = () => {
        item.remove();
        renumberItems('experienceList', 'خبرة عمل');
    };
    list.appendChild(item);
    renumberItems('experienceList', 'خبرة عمل');
    return item;
}

/**
 * Add a single-textarea repeatable row (used for ijazas & courses)
 */
function addSimpleListRow(listId, labelPrefix, inputClass, placeholder, value = '') {
    const list = document.getElementById(listId);
    const item = document.createElement('div');
    item.className = 'repeat-item repeat-item-simple';

    const header = document.createElement('div');
    header.className = 'repeat-item-header';
    const label = document.createElement('span');
    label.className = 'repeat-item-label';
    label.textContent = labelPrefix;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove-row';
    removeBtn.title = 'حذف';
    removeBtn.textContent = '✕';
    header.appendChild(label);
    header.appendChild(removeBtn);

    const textarea = document.createElement('textarea');
    textarea.className = inputClass;
    textarea.placeholder = placeholder;
    textarea.value = value;

    item.appendChild(header);
    item.appendChild(textarea);

    removeBtn.onclick = () => {
        item.remove();
        renumberItems(listId, labelPrefix);
    };

    list.appendChild(item);
    renumberItems(listId, labelPrefix);
    return item;
}

function addIjazaRow(value = '') {
    return addSimpleListRow(
        'ijazaList',
        'إجازة',
        'ijaza-text',
        'مثلاً: إجازة في القرآن الكريم كاملاً برواية حفص عن عاصم، المجيز: الشيخ ...، 2015',
        value
    );
}

function addCourseRow(value = '') {
    return addSimpleListRow(
        'courseList',
        'دورة / شهادة',
        'course-text',
        'مثلاً: دورة في أحكام التجويد المتقدمة – 2022',
        value
    );
}

/** Read all filled-in experience rows from the DOM */
function collectExperiences() {
    return Array.from(document.querySelectorAll('#experienceList .repeat-item')).map(item => ({
        positionName: item.querySelector('.exp-position').value.trim(),
        workPlace: item.querySelector('.exp-workplace').value.trim(),
        workFromYear: item.querySelector('.exp-from').value.trim(),
        workToYear: item.querySelector('.exp-to').value.trim(),
        jobResponsibilities: item.querySelector('.exp-resp').value.trim()
    })).filter(exp => exp.positionName || exp.workPlace || exp.jobResponsibilities || exp.workFromYear || exp.workToYear);
}

function collectIjazas() {
    return Array.from(document.querySelectorAll('#ijazaList .ijaza-text'))
        .map(t => t.value.trim())
        .filter(Boolean);
}

function collectCourses() {
    return Array.from(document.querySelectorAll('#courseList .course-text'))
        .map(t => t.value.trim())
        .filter(Boolean);
}

/**
 * Save form data (+ repeatable lists) to localStorage
 */
function saveData() {
    const formData = new FormData(document.getElementById('cvForm'));
    const data = Object.fromEntries(formData);
    const lists = {
        experiences: collectExperiences(),
        ijazas: collectIjazas(),
        courses: collectCourses()
    };

    localStorage.setItem('cvData', JSON.stringify(data));
    localStorage.setItem('cvLists', JSON.stringify(lists));
    showStatus('تم حفظ البيانات بنجاح! ✅', 'success');
}

/**
 * Load form data (+ repeatable lists) from localStorage.
 * Also migrates data saved by the older single-entry version of the form.
 */
function loadData() {
    const saved = localStorage.getItem('cvData');
    const data = saved ? JSON.parse(saved) : {};
    Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field) field.value = data[key];
    });

    const savedLists = localStorage.getItem('cvLists');
    const lists = savedLists ? JSON.parse(savedLists) : null;

    // Work experience
    if (lists && lists.experiences && lists.experiences.length) {
        lists.experiences.forEach(exp => addExperienceRow(exp));
    } else if (data.positionName || data.workPlace || data.jobResponsibilities) {
        // Migrate data saved by the old single-experience form
        addExperienceRow({
            positionName: data.positionName,
            workPlace: data.workPlace,
            workFromYear: data.workFromYear,
            workToYear: data.workToYear,
            jobResponsibilities: data.jobResponsibilities
        });
    } else {
        addExperienceRow();
    }

    // Quranic ijazas
    if (lists && lists.ijazas && lists.ijazas.length) {
        lists.ijazas.forEach(text => addIjazaRow(text));
    } else if (data.quranicIjaza) {
        data.quranicIjaza.split('\n').filter(Boolean).forEach(line => addIjazaRow(line));
    } else {
        addIjazaRow();
    }

    // Courses / certificates
    if (lists && lists.courses && lists.courses.length) {
        lists.courses.forEach(text => addCourseRow(text));
    } else if (data.additionalCertificates) {
        data.additionalCertificates.split('\n').filter(Boolean).forEach(line => addCourseRow(line));
    } else {
        addCourseRow();
    }
}

/**
 * Reset form, clear localStorage, and restore a single empty row per list
 */
function resetForm() {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
        localStorage.removeItem('cvData');
        localStorage.removeItem('cvLists');
        document.getElementById('cvForm').reset();

        document.getElementById('experienceList').innerHTML = '';
        document.getElementById('ijazaList').innerHTML = '';
        document.getElementById('courseList').innerHTML = '';
        addExperienceRow();
        addIjazaRow();
        addCourseRow();

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
    statusEl.style.display = 'block';

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
 * @param {Object} data - Single-value form fields
 * @param {Object} lists - { experiences, ijazas, courses } arrays
 * @returns {string} HTML markup for the CV page
 */
function buildPreviewHtml(data, lists = {}) {
    const experiences = lists.experiences || [];
    const ijazas = lists.ijazas || [];
    const courses = lists.courses || [];

    const qualParts = [];
    if (data.academicQualification) qualParts.push(`<p><strong>المؤهل العلمي:</strong> ${escapeHtml(data.academicQualification)}</p>`);
    if (data.institution) qualParts.push(`<p>${escapeHtml(data.institution)}${data.qualYear ? ' (' + escapeHtml(data.qualYear) + ')' : ''}</p>`);
    if (ijazas.length) {
        qualParts.push(`<p><strong>الإجازات القرآنية والأسانيد:</strong></p>`);
        qualParts.push(`<ul class="cv-list">${ijazas.map(t => `<li>${nl2br(t)}</li>`).join('')}</ul>`);
    }
    if (courses.length) {
        qualParts.push(`<p><strong>الدورات والشهادات التخصصية:</strong></p>`);
        qualParts.push(`<ul class="cv-list">${courses.map(t => `<li>${nl2br(t)}</li>`).join('')}</ul>`);
    }

    const expParts = experiences.map(exp => {
        const rows = [];
        const headerParts = [exp.positionName, exp.workPlace].filter(Boolean).map(escapeHtml);
        if (headerParts.length) rows.push(`<p><strong>${headerParts.join(' – ')}</strong></p>`);
        if (exp.workFromYear || exp.workToYear) {
            rows.push(`<p class="cv-muted">${escapeHtml(exp.workFromYear) || 'من'} – ${escapeHtml(exp.workToYear) || 'إلى'}</p>`);
        }
        if (exp.jobResponsibilities) rows.push(`<p>${nl2br(exp.jobResponsibilities)}</p>`);
        return `<div class="cv-exp-item">${rows.join('')}</div>`;
    });
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
                ${data.phone ? `<span>📞 <bdi dir="ltr">${escapeHtml(data.phone)}</bdi></span>` : ''}
                ${data.email ? `<span>✉️ <bdi dir="ltr">${escapeHtml(data.email)}</bdi></span>` : ''}
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
    const lists = {
        experiences: collectExperiences(),
        ijazas: collectIjazas(),
        courses: collectCourses()
    };

    if (!data.fullName || !data.location || !data.email || !data.phone) {
        showStatus('⚠️ الرجاء ملء جميع الحقول المطلوبة (مشار إليها بـ *)', 'error');
        return;
    }

    const pdfBtn = document.querySelector('.btn-pdf');
    pdfBtn.disabled = true;
    showStatus('⏳ جاري تجهيز ملف PDF...', 'success');

    const preview = document.getElementById('cvPreview');
    preview.innerHTML = buildPreviewHtml(data, lists);

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

/* =========================================================
   Word (.docx) export — hand-built but spec-complete OOXML
   package (styles/settings/fontTable/docProps + page setup)
   so real Microsoft Word opens it without a repair prompt.
   ========================================================= */

/**
 * Build one Word run. Arabic (and any label text) defaults to RTL;
 * pass { ltr: true } for phone numbers / emails so a leading "+" or
 * "@" doesn't get visually reordered inside the RTL paragraph.
 */
function wRun(text, opts = {}) {
    const props = [opts.ltr ? '<w:rtl w:val="0"/>' : '<w:rtl/>'];
    if (opts.bold) props.push('<w:b/>');
    if (opts.italic) props.push('<w:i/>');
    if (opts.size) props.push(`<w:sz w:val="${opts.size}"/>`);
    return `<w:r><w:rPr>${props.join('')}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
}

/** Build one Word paragraph wrapping the given run(s) XML */
function wPara(runsXml, opts = {}) {
    const pProps = ['<w:bidi/>'];
    if (opts.center) pProps.push('<w:jc w:val="center"/>');
    if (opts.spacingAfter) pProps.push(`<w:spacing w:after="${opts.spacingAfter}"/>`);
    return `<w:p><w:pPr>${pProps.join('')}</w:pPr>${runsXml}</w:p>`;
}

/** One paragraph per line of text (for textarea content with line breaks) */
function wMultilinePara(text, opts = {}) {
    return String(text).split('\n').map(line => wPara(wRun(line, opts))).join('');
}

/** A bulleted block: "• " on the first line, indented continuation lines */
function wBulletBlock(text) {
    return String(text).split('\n').map((line, idx) => wPara(wRun((idx === 0 ? '• ' : '   ') + line))).join('');
}

/**
 * Create Word document.xml body
 * @param {Object} data - Single-value form fields
 * @param {Object} lists - { experiences, ijazas, courses } arrays
 * @returns {string} Word XML content
 */
function createWordXml(data, lists = {}) {
    const experiences = lists.experiences || [];
    const ijazas = lists.ijazas || [];
    const courses = lists.courses || [];

    const sectionTitle = (text) => wPara(wRun(text, { bold: true, size: 48 }), { spacingAfter: 120 });
    const sectionBreak = wPara('', { spacingAfter: 200 });

    // البيانات الشخصية
    const personalLines = [];
    personalLines.push(wPara(wRun('▪ الاسم الكامل: ' + data.fullName)));
    if (data.jobTitle) personalLines.push(wPara(wRun('▪ المسمى المهني: ' + data.jobTitle)));
    if (data.location) personalLines.push(wPara(wRun('▪ مكان الإقامة: ' + data.location)));
    if (data.yearsExp) personalLines.push(wPara(wRun('▪ سنوات الخبرة: ' + data.yearsExp + ' سنة')));
    if (data.phone) personalLines.push(wPara(wRun('▪ الهاتف / واتساب: ') + wRun(data.phone, { ltr: true })));
    if (data.email) personalLines.push(wPara(wRun('▪ البريد الإلكتروني: ') + wRun(data.email, { ltr: true })));
    if (data.languages) personalLines.push(wPara(wRun('▪ اللغات: ' + data.languages)));

    // المؤهلات والإجازات والدورات
    const qualLines = [];
    if (data.academicQualification) qualLines.push(wPara(wRun('المؤهل العلمي: ' + data.academicQualification, { bold: true })));
    if (data.institution) qualLines.push(wPara(wRun(data.institution + (data.qualYear ? ' (' + data.qualYear + ')' : ''))));
    if (ijazas.length) {
        qualLines.push(wPara(wRun('الإجازات القرآنية والأسانيد:', { bold: true })));
        ijazas.forEach(text => qualLines.push(wBulletBlock(text)));
    }
    if (courses.length) {
        qualLines.push(wPara(wRun('الدورات والشهادات التخصصية:', { bold: true })));
        courses.forEach(text => qualLines.push(wBulletBlock(text)));
    }

    // الخبرة العملية (قد تكون عدة وظائف)
    const expLines = [];
    experiences.forEach(exp => {
        const headerParts = [exp.positionName, exp.workPlace].filter(Boolean);
        if (headerParts.length) expLines.push(wPara(wRun(headerParts.join(' – '), { bold: true })));
        if (exp.workFromYear || exp.workToYear) {
            expLines.push(wPara(wRun('الفترة: ' + (exp.workFromYear || 'من') + ' – ' + (exp.workToYear || 'إلى'))));
        }
        if (exp.jobResponsibilities) expLines.push(wMultilinePara(exp.jobResponsibilities));
    });
    if (data.numStudents) expLines.push(wPara(wRun('عدد الطلاب المدرسين: ' + data.numStudents)));
    if (data.targetAges) expLines.push(wPara(wRun('الفئات العمرية المستهدفة: ' + data.targetAges)));

    // أسلوب التدريس
    const teachLines = [];
    if (data.platforms) teachLines.push(wPara(wRun('المنصات المستخدمة: ' + data.platforms)));
    if (data.lessonDuration) teachLines.push(wPara(wRun('مدة الحصة: ' + data.lessonDuration + ' دقيقة')));
    if (data.lessonsPerWeek) teachLines.push(wPara(wRun('عدد الحصص أسبوعياً: ' + data.lessonsPerWeek)));
    if (data.teachingDays) teachLines.push(wPara(wRun('أيام التدريس: ' + data.teachingDays)));
    if (data.teachingMethod) {
        teachLines.push(wPara(wRun('منهجية التدريس:', { bold: true })));
        teachLines.push(wMultilinePara(data.teachingMethod));
    }
    if (data.achievements) {
        teachLines.push(wPara(wRun('الإنجازات والأنشطة البارزة:', { bold: true })));
        teachLines.push(wMultilinePara(data.achievements));
    }

    // معلومات التواصل (ملخص في نهاية المستند)
    const contactLines = [wPara(wRun('الاسم: ' + data.fullName))];
    if (data.phone) contactLines.push(wPara(wRun('واتساب / هاتف: ') + wRun(data.phone, { ltr: true })));
    if (data.email) contactLines.push(wPara(wRun('البريد الإلكتروني: ') + wRun(data.email, { ltr: true })));

    const sections = [];
    if (personalLines.length) sections.push(sectionTitle('👤 البيانات الشخصية') + personalLines.join(''));
    if (data.biography) sections.push(sectionTitle('📝 النبذة المهنية') + wMultilinePara(data.biography));
    if (qualLines.length) sections.push(sectionTitle('🎓 المؤهلات العلمية والإجازات القرآنية') + qualLines.join(''));
    if (expLines.length) sections.push(sectionTitle('💼 الخبرة في تعليم وتحفيظ القرآن الكريم') + expLines.join(''));
    if (teachLines.length) sections.push(sectionTitle('💻 أسلوب التدريس أونلاين') + teachLines.join(''));
    sections.push(sectionTitle('📞 معلومات التواصل') + contactLines.join(''));

    const titleBlock = wPara(wRun('السيرة الذاتية المهنية', { bold: true, size: 56 }), { center: true }) +
        (data.jobTitle ? wPara(wRun(data.jobTitle, { italic: true, size: 44 }), { center: true }) : '');

    // A4 page, ~2.5cm margins, right-to-left section layout
    const sectPr = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
        '<w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/>' +
        '<w:bidi/></w:sectPr>';

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>
${titleBlock}
${sectionBreak}
${sections.join(sectionBreak)}
${sectPr}
</w:body>
</w:document>`;
}

function createRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
}

function createDocRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>`;
}

function createContentTypes() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
<Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

function createCoreProps(title) {
    const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>${escapeXml(title)}</dc:title>
<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
<dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

function createAppProps() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
<Application>CV Form Generator</Application>
</Properties>`;
}

function createStylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults>
<w:rPrDefault>
<w:rPr>
<w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
<w:sz w:val="24"/>
<w:szCs w:val="24"/>
<w:rtl/>
</w:rPr>
</w:rPrDefault>
<w:pPrDefault>
<w:pPr>
<w:bidi/>
<w:spacing w:after="120" w:line="276" w:lineRule="auto"/>
</w:pPr>
</w:pPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal">
<w:name w:val="Normal"/>
<w:qFormat/>
</w:style>
</w:styles>`;
}

function createSettingsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:defaultTabStop w:val="720"/>
</w:settings>`;
}

function createFontTableXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:font w:name="Arial">
<w:family w:val="swiss"/>
<w:pitch w:val="variable"/>
</w:font>
</w:fonts>`;
}

/**
 * Generate Word (.docx) document from form data
 */
function generateDocument() {
    const formData = new FormData(document.getElementById('cvForm'));
    const data = Object.fromEntries(formData);
    const lists = {
        experiences: collectExperiences(),
        ijazas: collectIjazas(),
        courses: collectCourses()
    };

    if (!data.fullName || !data.location || !data.email || !data.phone) {
        showStatus('⚠️ الرجاء ملء جميع الحقول المطلوبة (مشار إليها بـ *)', 'error');
        return;
    }

    const wordBtn = document.querySelector('.btn-download');
    wordBtn.disabled = true;

    try {
        const wordContent = createWordXml(data, lists);

        const zip = new JSZip();
        zip.file('[Content_Types].xml', createContentTypes());
        zip.folder('_rels').file('.rels', createRels());
        zip.folder('docProps').file('core.xml', createCoreProps(data.fullName));
        zip.folder('docProps').file('app.xml', createAppProps());
        zip.folder('word').file('document.xml', wordContent);
        zip.folder('word').file('styles.xml', createStylesXml());
        zip.folder('word').file('settings.xml', createSettingsXml());
        zip.folder('word').file('fontTable.xml', createFontTableXml());
        zip.folder('word').folder('_rels').file('document.xml.rels', createDocRels());

        zip.generateAsync({ type: 'blob' }).then(blob => {
            saveAs(blob, `السيرة_الذاتية_${data.fullName}.docx`);
            showStatus('تم تنزيل السيرة الذاتية بنجاح! 📥', 'success');
        }).catch(err => {
            console.error('Error:', err);
            showStatus('حدث خطأ أثناء توليد المستند.', 'error');
        }).finally(() => {
            wordBtn.disabled = false;
        });
    } catch (error) {
        console.error('Error:', error);
        showStatus('حدث خطأ أثناء توليد المستند. الرجاء المحاولة مرة أخرى.', 'error');
        wordBtn.disabled = false;
    }
}
