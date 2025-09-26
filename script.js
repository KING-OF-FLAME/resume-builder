document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS (Unchanged) ---
    const form = document.getElementById('resumeForm');
    const resumePreview = document.getElementById('resumePreview');
    const downloadButton = document.getElementById('downloadButton');

    // --- UPDATED LIVE PREVIEW LOGIC for TWO-COLUMN LAYOUT ---
    const previewMap = {
        'fullName': { selector: '#previewName', type: 'text' },
        'jobTitle': { selector: '#previewTitle', type: 'text' },
        'location': { selector: '#previewLocation', type: 'text' },
        'summary': { selector: '#previewSummary', type: 'textarea' },
        'email': { selector: '#previewEmail', type: 'link', href: 'mailto:' },
        'phone': { selector: '#previewPhone', type: 'link', href: 'tel:' },
        'skills': { selector: '#previewSkills', type: 'skills' },
        'achievements': { selector: '#previewAchievements', type: 'achievements' }
    };

    const updatePreview = () => {
        for (const [id, config] of Object.entries(previewMap)) {
            const inputEl = document.getElementById(id);
            const previewEl = resumePreview.querySelector(config.selector);
            
            if (inputEl && previewEl) {
                const value = inputEl.value.trim();
                switch (config.type) {
                    case 'text':
                    case 'textarea':
                        previewEl.textContent = value;
                        break;
                    case 'link':
                        previewEl.textContent = value;
                        previewEl.href = `${config.href}${value}`;
                        break;
                    case 'skills':
                        updateSkillsPreview(value, previewEl);
                        break;
                    case 'achievements':
                        updateAchievementsPreview(value, previewEl);
                        break;
                }
            }
        }
        updateSectionVisibility();
    };

    const updateSkillsPreview = (value, container) => {
        container.innerHTML = '';
        value.split(',').map(s => s.trim()).filter(s => s).forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            container.appendChild(skillTag);
        });
    };

    const updateAchievementsPreview = (value, container) => {
        container.innerHTML = '';
        value.split(';').map(i => i.trim()).filter(i => i).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            container.appendChild(li);
        });
    };
    
    const updateSectionVisibility = () => {
        const sections = {
            '#summarySection': document.getElementById('summary').value.trim(),
            '#experienceSection': document.getElementById('previewExperience').innerHTML.trim(),
            '#projectsSection': document.getElementById('previewProjects').innerHTML.trim(),
            '#educationSection': document.getElementById('previewEducation').innerHTML.trim(),
            '#skillsSection': document.getElementById('previewSkills').innerHTML.trim(),
            '#certificationsSection': document.getElementById('previewCertifications').innerHTML.trim(),
            '#achievementsSection': document.getElementById('previewAchievements').innerHTML.trim(),
            '#languagesSection': document.getElementById('previewLanguages').innerHTML.trim(),
        };

        for (const [selector, content] of Object.entries(sections)) {
            const sectionEl = resumePreview.querySelector(selector);
            if(sectionEl) {
                sectionEl.style.display = content ? 'block' : 'none';
            }
        }
        // Also hide individual contact elements if empty
        document.getElementById('previewLocation').style.display = document.getElementById('location').value ? 'block' : 'none';
        document.getElementById('previewEmail').parentElement.style.display = document.getElementById('email').value ? 'block' : 'none';
        document.getElementById('previewPhone').parentElement.style.display = document.getElementById('phone').value ? 'block' : 'none';
    };

    // --- DYNAMIC SECTION FACTORY (Unchanged) ---
    const createDynamicSection = (config) => {
        const container = document.getElementById(config.containerId);
        const addButton = document.getElementById(config.addButtonId);
        const previewContainer = document.getElementById(config.previewContainerId);
        const template = document.getElementById(config.templateId);
        let itemCount = 0;

        addButton.addEventListener('click', () => {
            itemCount++;
            const newItem = document.createElement('div');
            newItem.className = 'dynamic-item';
            newItem.dataset.id = itemCount;
            
            let formHtml = config.fields.map(field => `
                <div class="form-group ${field.className || ''}">
                    <label for="${field.id}${itemCount}">${field.label}</label>
                    ${field.type === 'textarea'
                        ? `<textarea id="${field.id}${itemCount}" placeholder="${field.placeholder}"></textarea>`
                        : `<input type="${field.type || 'text'}" id="${field.id}${itemCount}" placeholder="${field.placeholder}">`
                    }
                </div>
            `).join('');

            newItem.innerHTML = `<div class="form-grid">${formHtml}</div><button type="button" class="btn-delete" aria-label="Delete item">&times;</button>`;
            container.appendChild(newItem);
        });

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                e.target.closest('.dynamic-item').remove();
                updateDynamicPreviews();
            }
        });

        const updateDynamicPreviews = () => {
            previewContainer.innerHTML = '';
            const items = container.querySelectorAll('.dynamic-item');
            items.forEach(item => {
                const clone = template.content.cloneNode(true);
                config.fields.forEach(field => {
                    const input = item.querySelector(`#${field.id}${item.dataset.id}`);
                    const previewEl = clone.querySelector(`[data-preview="${field.previewKey}"]`);
                    if (input && previewEl) {
                        if (field.isLink) {
                            previewEl.href = input.value;
                            previewEl.textContent = input.value.replace(/^(https?:\/\/)?(www\.)?/, '');
                        } else if (field.isList) {
                            previewEl.innerHTML = input.value.split(';').map(i => i.trim()).filter(i => i).map(i => `<li>${i}</li>`).join('');
                        } else {
                            previewEl.textContent = input.value;
                        }
                    }
                });
                previewContainer.appendChild(clone);
            });
            updateSectionVisibility();
        };
        
        return { update: updateDynamicPreviews };
    };

    // --- INITIALIZE DYNAMIC SECTIONS (Unchanged) ---
    const sections = [
        createDynamicSection({
            containerId: 'experienceContainer', addButtonId: 'addExperience', previewContainerId: 'previewExperience', templateId: 'experienceTemplate',
            fields: [
                { id: 'expTitle', label: 'Job Title', placeholder: 'Senior Developer', previewKey: 'title' },
                { id: 'expCompany', label: 'Company', placeholder: 'Innovate Inc.', previewKey: 'company' },
                { id: 'expDates', label: 'Dates', placeholder: 'Jan 2022 - Present', previewKey: 'dates' },
                { id: 'expDesc', label: 'Description (use ; for points)', type: 'textarea', placeholder: 'Led a team...', previewKey: 'description', isList: true, className: 'full-width' }
            ]
        }),
        createDynamicSection({
            containerId: 'projectsContainer', addButtonId: 'addProject', previewContainerId: 'previewProjects', templateId: 'projectTemplate',
            fields: [
                { id: 'projName', label: 'Project Name', placeholder: 'Resume Builder', previewKey: 'name' },
                { id: 'projLink', label: 'Link', placeholder: 'https://example.com', previewKey: 'link', isLink: true },
                { id: 'projDesc', label: 'Description', type: 'textarea', placeholder: 'A web app for...', previewKey: 'description', className: 'full-width' }
            ]
        }),
        createDynamicSection({
            containerId: 'educationContainer', addButtonId: 'addEducation', previewContainerId: 'previewEducation', templateId: 'educationTemplate',
            fields: [
                { id: 'eduDegree', label: 'Degree/Certificate', placeholder: 'B.S. in Computer Science', previewKey: 'degree' },
                { id: 'eduInstitution', label: 'Institution', placeholder: 'State University', previewKey: 'institution' },
                { id: 'eduDates', label: 'Dates', placeholder: '2016 - 2020', previewKey: 'dates' },
            ]
        }),
        createDynamicSection({
            containerId: 'certificationsContainer', addButtonId: 'addCertification', previewContainerId: 'previewCertifications', templateId: 'certificationTemplate',
            fields: [
                { id: 'certName', label: 'Certificate Name', placeholder: 'AWS Certified Developer', previewKey: 'name' },
                { id: 'certIssuer', label: 'Issuing Body', placeholder: 'Amazon Web Services', previewKey: 'issuer' },
            ]
        }),
        createDynamicSection({
            containerId: 'languagesContainer', addButtonId: 'addLanguage', previewContainerId: 'previewLanguages', templateId: 'languageTemplate',
            fields: [
                { id: 'langName', label: 'Language', placeholder: 'English', previewKey: 'language' },
                { id: 'langProf', label: 'Proficiency', placeholder: 'Native', previewKey: 'proficiency' },
            ]
        }),
        createDynamicSection({
            containerId: 'socialLinksContainer', addButtonId: 'addSocialLink', previewContainerId: 'previewSocials', templateId: 'socialLinkTemplate',
            fields: [
                { id: 'socialURL', label: 'URL (e.g., LinkedIn, GitHub)', placeholder: 'https://linkedin.com/in/janedoe', previewKey: 'url', isLink: true, className: 'full-width' },
            ]
        })
    ];

    // --- PDF GENERATION (Unchanged) ---
    const handlePdfDownload = async () => {
        const dataObject = {};
        // Scrape static fields
        document.querySelectorAll('#resumeForm input, #resumeForm textarea').forEach(input => {
            if (input.id) {
                dataObject[input.id] = input.value;
            }
        });

        // Scrape dynamic fields
        dataObject.experience = getDynamicSectionData('experienceContainer');
        dataObject.projects = getDynamicSectionData('projectsContainer');
        dataObject.education = getDynamicSectionData('educationContainer');
        dataObject.certifications = getDynamicSectionData('certificationsContainer');
        dataObject.languages = getDynamicSectionData('languagesContainer');
        dataObject.socialLinks = getDynamicSectionData('socialLinksContainer');

        downloadButton.textContent = 'Generating...';
        downloadButton.disabled = true;

        try {
            const response = await fetch('generate-pdf.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataObject)
            });

            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Sorry, there was an error generating your PDF. Please try again.');
        } finally {
            downloadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg> Download PDF`;
            downloadButton.disabled = false;
        }
    };
    
    const getDynamicSectionData = (containerId) => {
        const container = document.getElementById(containerId);
        const items = [];
        container.querySelectorAll('.dynamic-item').forEach(item => {
            const itemData = {};
            item.querySelectorAll('input, textarea').forEach(input => {
                const key = input.id.replace(/\d+$/, '');
                itemData[key] = input.value;
            });
            items.push(itemData);
        });
        return items;
    };

    // --- SAMPLE DATA (Unchanged) ---
    const populateSampleData = () => {
        document.getElementById('fullName').value = 'Alex Doe';
        document.getElementById('jobTitle').value = 'Senior Software Engineer';
        document.getElementById('email').value = 'alex.doe@example.com';
        document.getElementById('phone').value = '+1 987-654-3210';
        document.getElementById('location').value = 'New York, NY';
        document.getElementById('summary').value = 'Results-driven Senior Software Engineer with 8+ years of experience architecting, developing, and deploying scalable, high-performance web applications. Expert in the MERN stack with a passion for clean code, agile methodologies, and creating exceptional user experiences.';

        document.getElementById('addSocialLink').click();
        document.querySelector('#socialLinksContainer .dynamic-item:last-child [id^="socialURL"]').value = 'https://linkedin.com/in/alexdoe';
        document.getElementById('addSocialLink').click();
        document.querySelector('#socialLinksContainer .dynamic-item:last-child [id^="socialURL"]').value = 'https://github.com/alexdoe';

        document.getElementById('addExperience').click();
        const exp1 = document.querySelector('#experienceContainer .dynamic-item:last-child');
        exp1.querySelector('[id^="expTitle"]').value = 'Senior Software Engineer';
        exp1.querySelector('[id^="expCompany"]').value = 'Tech Solutions Inc.';
        exp1.querySelector('[id^="expDates"]').value = 'Jan 2020 - Present';
        exp1.querySelector('[id^="expDesc"]').value = 'Led the backend development for a major e-commerce platform, increasing performance by 40%;Mentored a team of 5 junior engineers, improving team productivity and code quality;Implemented a CI/CD pipeline that reduced deployment time by over 50%.';
        
        document.getElementById('addExperience').click();
        const exp2 = document.querySelector('#experienceContainer .dynamic-item:last-child');
        exp2.querySelector('[id^="expTitle"]').value = 'Software Engineer';
        exp2.querySelector('[id^="expCompany"]').value = 'Web Innovators LLC';
        exp2.querySelector('[id^="expDates"]').value = 'Jun 2017 - Dec 2019';
        exp2.querySelector('[id^="expDesc"]').value = 'Developed and maintained full-stack features for a SaaS product using React and Node.js;Collaborated with designers to create responsive and user-friendly interfaces;Wrote comprehensive unit and integration tests to ensure code reliability.';

        document.getElementById('addProject').click();
        const proj1 = document.querySelector('#projectsContainer .dynamic-item:last-child');
        proj1.querySelector('[id^="projName"]').value = 'LiveStock Portfolio Tracker';
        proj1.querySelector('[id^="projLink"]').value = 'https://github.com/alexdoe/stock-tracker';
        proj1.querySelector('[id^="projDesc"]').value = 'A real-time stock tracking web application built with React, WebSockets, and Chart.js that allows users to monitor their investments.';

        document.getElementById('addEducation').click();
        const edu1 = document.querySelector('#educationContainer .dynamic-item:last-child');
        edu1.querySelector('[id^="eduDegree"]').value = 'B.S. in Computer Science';
        edu1.querySelector('[id^="eduInstitution"]').value = 'University of Technology';
        edu1.querySelector('[id^="eduDates"]').value = '2013 - 2017';
        
        document.getElementById('skills').value = 'JavaScript (ES6+), React, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS, Git, Agile Methodologies';
        document.getElementById('achievements').value = 'Winner, Company Hackathon 2021;Speaker at DevConf 2022;Published 3 articles on advanced Node.js topics on Medium.';

        document.getElementById('addCertification').click();
        const cert1 = document.querySelector('#certificationsContainer .dynamic-item:last-child');
        cert1.querySelector('[id^="certName"]').value = 'AWS Certified Developer - Associate';
        cert1.querySelector('[id^="certIssuer"]').value = 'Amazon Web Services';
        
        document.getElementById('addLanguage').click();
        const lang1 = document.querySelector('#languagesContainer .dynamic-item:last-child');
        lang1.querySelector('[id^="langName"]').value = 'English';
        lang1.querySelector('[id^="langProf"]').value = 'Native';
        document.getElementById('addLanguage').click();
        const lang2 = document.querySelector('#languagesContainer .dynamic-item:last-child');
        lang2.querySelector('[id^="langName"]').value = 'Spanish';
        lang2.querySelector('[id^="langProf"]').value = 'Professional Working Proficiency';
    };

    // --- EVENT LISTENERS (Unchanged) ---
    form.addEventListener('input', () => {
        updatePreview();
        sections.forEach(section => section.update());
    });
    
    downloadButton.addEventListener('click', handlePdfDownload);


    // --- INITIALIZATION ---
    populateSampleData();
    document.querySelectorAll('#resumeForm input, #resumeForm textarea').forEach(input => {
        input.dispatchEvent(new Event('input', { bubbles: true }));
    });
});