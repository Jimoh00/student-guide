lucide.createIcons();


onboardingSection = document.getElementById("onboarding");
departmentSection = document.getElementById("department-section");
facultySection = document.getElementById("faculty-section");
checkListSection = document.getElementById("checkList-section");
progressSection = document.getElementById('progress-section');
directionSection = document.getElementById("direction-section");
const rmdSection = document.getElementById('rmd-section');

onboardingCta = document.querySelector(".cta-onboarding");


currentPage = onboardingSection;

onboardingCta.addEventListener('click', () => {
    currentPage.classList.remove('visible');
    currentPage = departmentSection;
    currentPage.classList.add('visible');
});


let selectedCard = null;
let selectedFaculty = null;
const deptBtn = document.querySelector('.department-btn');
deptBtn.disabled = true;
deptBtn.style.background = "hsl(213, 20%, 75%)"; 



fetch('db.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('department-container');

        // Clear loading message
        container.innerHTML = '';

        // Create a card for each item
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = `department-card py-3 px-5`;
            
            card.innerHTML = `
                <div class="faculty">${item.dept}</div>
            `;

            // Store all data on the card element
            card.dataset.faculty = item.fac;
            card.dataset.dept = item.dept;
            card.dataset.campus = item.campus;

            card.addEventListener('click', () => {
                if (selectedCard && selectedCard !== card) {
                    selectedCard.classList.remove('active');
                }

                if (selectedCard === card) {
                    card.classList.remove('active');
                    selectedCard = null;
                    selectedFaculty = null;
                    deptBtn.disabled = true;
                    deptBtn.style.background = "hsl(213, 20%, 75%)"; 
                } else {
                    card.classList.add('active');
                    selectedCard = card;
                    selectedFaculty = item.fac;
                    selectedDept = item.dept;
                    deptBtn.disabled = false;
                    deptBtn.style.background = "hsl(213, 49%, 52%)"
                }
            });
            
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });


const inputPlaceholder = document.querySelector('.input-placeholder');

inputPlaceholder.addEventListener('click', () => {
    inputPlaceholder.classList.add('active');
});

const searchBar = document.getElementById('dept-search');

searchBar.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    
    // Get all department cards
    const cards = document.querySelectorAll('.department-card');
    
    // Loop through cards and hide/show based on search
    cards.forEach(card => {
        const deptName = card.querySelector('.faculty').textContent.toLowerCase();
        
        if (deptName.includes(searchText)) {
            card.style.display = 'flex';  // Show card
        } else {
            card.style.display = 'none';  // Hide card
        }
    });
});



deptBtn.addEventListener('click', () => {
    if (selectedCard && selectedFaculty){
        const dept = selectedCard.dataset.dept;
        const campus = selectedCard.dataset.campus;
        const deptName = document.getElementById('deptName');
        const facName = document.getElementById('facName');

        // Display the faculty in your element (replace 'faculty-display' with your actual element ID)
        const facultyDisplayElement = document.getElementById('faculty-display');
        facName.textContent = selectedFaculty;
        deptName.textContent = selectedDept;
        facultyDisplayElement.textContent = selectedFaculty;



        currentPage.classList.remove('visible');
        currentPage = facultySection;
        currentPage.classList.add('visible');
    } else {
        deptBtn.style.background = '#004a7c';
    }
});


const BacktoDeptBtn = document.getElementById("bt-dept-btn");

BacktoDeptBtn.addEventListener('click', () => {
    currentPage.classList.remove('visible');
    currentPage = departmentSection;
    currentPage.classList.add('visible');
});


const facBtn = document.getElementById('facBtn');

facBtn.addEventListener('click', () => {
    currentPage.classList.remove('visible');
    currentPage = checkListSection;
    currentPage.classList.add('visible');
});

const item = document.querySelectorAll('.item');
const selectAllBtn = document.querySelector('.item-all');
const checkerAll = document.querySelector('.checker-all');


const checkedItems = [];
const uncheckedItems = [];

function updateArrays() {
    checkedItems.length = 0;
    uncheckedItems.length = 0;

    item.forEach((itm) => {
        const documentName = itm.querySelector('label').textContent;
        
        if (itm.classList.contains('active')) {
            checkedItems.push(documentName);
        } else {
            uncheckedItems.push(documentName);
        }
    });

    console.log('Checked ITems:', checkedItems)
    console.log('Unchecked Items:', uncheckedItems)
}




const documentInstructions = {
    "JAMB Admission Letter (original copy)": "Visit JAMB portal at jamb.gov.ng/efacility and print your admission letter",
    "Acceptance Receipt": "Pay acceptance fee at the university bursary and collect receipt",
    "O'Level Result": "Download from WAEC or NECO portal with your scratch card",
    "Birth Certificate": "Get from National Population Commission or your Local Government",
    "Passport Photograph (at least 30 copies)": "Visit any photo studio - white background, formal wear",
    "State of Origin Certificate": "Collect from your Local Government headquarters",
    "Medical Clearance": "Visit university health center for medical examination",
    "Screening Result": "Print from university portal after screening",
    "Osun Admission Letter": "Download from UNIOSUN admission portal",
    "Tax Clearance": "Get from State Internal Revenue Service office",
    "JAMB Result": "Print from JAMB portal at jamb.gov.ng/efacility"
};


const accordionContainer = document.getElementById('unchecked-accordion');





function showResults() {
    const totalItems = item.length;
    const checkedCount = checkedItems.length;
    const checkedCountDisplay = document.getElementById('checkedCountDipslay');
    const uncheckedCount = uncheckedItems.length;
    const progress = document.getElementById('progress');
    const percentageDisplay = document.getElementById('percentageDisplay');



    accordionContainer.innerHTML = '';

    uncheckedItems.forEach(documentName => {
        const instruction = documentInstructions[documentName];

        const accordionHTML = `
            <div class="accordion-item">
                <div class="accordion-header">
                    <span>${documentName}</span>
                    <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        ${instruction}
                    </div>
                </div>
            </div>
        `;

        accordionContainer.innerHTML += accordionHTML;
    }); 

    addAccordionEvents();




    const percentage = Math.round((checkedCount / totalItems) * 100);
    percentageDisplay.textContent = percentage;
    console.log(checkedCount);
    checkedCountDisplay.textContent = checkedCount;
    progress.style.width = percentage + '%';

    if (percentage < 30) {
        progress.style.background = "#EF4444";
    } else if (percentage < 70) {
        progress.style.background = "#F59E0B";
    } else if (percentage < 100) {
        progress.style.background = "#3B82F6";
    } else {
        progress.style.background = "#10B981";
    }
};


function addAccordionEvents() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
}


selectAllBtn.addEventListener('click', () => {
    item.forEach((itm) => {
        itm.classList.toggle('active');

        updateArrays();
    });


    checkerAll.classList.toggle('active');
});

item.forEach((itm) => {
    itm.addEventListener('click', () => {
        itm.classList.toggle('active');

        updateArrays();
    })
});

updateArrays();


const checkListCta = document.getElementById('checklist-cta');

checkListCta.addEventListener('click', () => {
    currentPage.classList.remove('visible');
    currentPage = progressSection;
    currentPage.classList.add('visible');
    showResults();
});


// Get all accordion headers
const accordionHeaders = document.querySelectorAll('.accordion-header');

// Add click event to each header
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        // Get the content part (next element after header)
        const content = header.nextElementSibling;
        
        // Toggle active class on header
        header.classList.toggle('active');
        
        // Toggle active class on content
        content.classList.toggle('active');
    });
});


const progressCta = document.getElementById('progress-cta');

progressCta.addEventListener('click', () => {
    currentPage.classList.remove('visible');
    currentPage = directionSection;
    currentPage.classList.add('visible');
});


const directionCta = document.getElementById('direction-cta');

directionCta.addEventListener('click', () => {
    currentPage.classList.remove('visible');
    currentPage = rmdSection;
    currentPage.classList.add('visible');
});


fetch('group.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        return response.json();
    })
    .then(data => {
        const facContainer = document.querySelector('.fac-container');
        facContainer.innerHTML = '';
        const faculties = data.faculty;

        faculties.forEach(item => {
            const anchor = document.createElement('a');
            anchor.className = `py-3 px-5 rmd-card`

            anchor.textContent = item.group;
            anchor.href = item.link;


            facContainer.appendChild(anchor);
        })

        const hostelContaienr = document.querySelector('.hostel-container');
        hostelContaienr.innerHTML = '';
        const agency = data.agents;

        agency.forEach(item => {
            const anchor = document.createElement('a');
            anchor.className = `py-3 px-5 rmd-card`

            anchor.textContent = item.agent;
            anchor.href = item.link;


            hostelContaienr.appendChild(anchor);
        });


        const funContainer = document.querySelector('.fun-container');
        funContainer.innerHTML = '';
        const fun = data.fun;

        fun.forEach(item => {
            const anchor = document.createElement('a');
            anchor.className = `py-3 px-5 rmd-card`

            anchor.textContent = item.group;
            anchor.href = item.link;


            funContainer.appendChild(anchor);
        });
    })
    .catch(error => console.error(error));