// Main JavaScript for SEO Competitor Analyzer

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Dark Mode Toggle
    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            this.classList.remove('fa-moon');
            this.classList.add('fa-sun');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            this.classList.remove('fa-sun');
            this.classList.add('fa-moon');
        }
    });

    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').classList.remove('fa-moon');
        document.getElementById('dark-mode-toggle').classList.add('fa-sun');
    }

    // Quick Start Wizard Navigation
    const wizardNext = document.getElementById('wizard-next');
    const wizardPrev = document.getElementById('wizard-prev');
    const wizardFinish = document.getElementById('wizard-finish');
    
    if (wizardNext && wizardPrev && wizardFinish) {
        let currentStep = 1;
        const totalSteps = 3;
        
        wizardNext.addEventListener('click', function() {
            if (currentStep < totalSteps) {
                document.getElementById(`wizard-step-${currentStep}`).classList.remove('active');
                currentStep++;
                document.getElementById(`wizard-step-${currentStep}`).classList.add('active');
                
                wizardPrev.disabled = false;
                
                if (currentStep === totalSteps) {
                    wizardNext.style.display = 'none';
                    wizardFinish.style.display = 'block';
                }
            }
        });
        
        wizardPrev.addEventListener('click', function() {
            if (currentStep > 1) {
                document.getElementById(`wizard-step-${currentStep}`).classList.remove('active');
                currentStep--;
                document.getElementById(`wizard-step-${currentStep}`).classList.add('active');
                
                if (currentStep === 1) {
                    wizardPrev.disabled = true;
                }
                
                if (currentStep < totalSteps) {
                    wizardNext.style.display = 'block';
                    wizardFinish.style.display = 'none';
                }
            }
        });
        
        wizardFinish.addEventListener('click', function() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('quickStartWizard'));
            modal.hide();
            
            // Update progress tracker
            document.getElementById('step-competitors').innerHTML = '<i class="fas fa-circle"></i> Find Competitors';
            
            // Save user domain
            const userDomain = document.getElementById('user-domain').value;
            if (userDomain) {
                localStorage.setItem('userDomain', userDomain);
            }
        });
    }

    // Progress Tracker Update
    function updateProgressTracker(step) {
        const steps = ['competitors', 'keywords', 'sitemaps', 'content', 'rankings'];
        const currentIndex = steps.indexOf(step);
        
        if (currentIndex >= 0) {
            for (let i = 0; i <= currentIndex; i++) {
                document.getElementById(`step-${steps[i]}`).innerHTML = `<i class="fas fa-check-circle"></i> ${steps[i].charAt(0).toUpperCase() + steps[i].slice(1)}`;
                document.getElementById(`step-${steps[i]}`).classList.add('active');
            }
        }
    }

    // Check current page and update progress tracker
    const currentPath = window.location.pathname;
    if (currentPath.includes('competitors')) {
        updateProgressTracker('competitors');
    } else if (currentPath.includes('keywords')) {
        updateProgressTracker('keywords');
    } else if (currentPath.includes('sitemaps')) {
        updateProgressTracker('sitemaps');
    } else if (currentPath.includes('content')) {
        updateProgressTracker('content');
    } else if (currentPath.includes('rank-tracker')) {
        updateProgressTracker('rankings');
    }

    // API Calls for Data
    function fetchCompetitors() {
        if (document.getElementById('competitorTable')) {
            fetch('/api/competitors')
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.querySelector('#competitorTable tbody');
                    tableBody.innerHTML = '';
                    
                    data.forEach(competitor => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>
                                <div class="form-check">
                                    <input class="form-check-input competitor-select" type="checkbox" value="${competitor.domain}">
                                </div>
                            </td>
                            <td>${competitor.domain}</td>
                            <td>${competitor.traffic.toLocaleString()}</td>
                            <td>${competitor.overlap}%</td>
                            <td>${competitor.da}</td>
                            <td><span class="badge ${competitor.type === 'seo' ? 'bg-success' : 'bg-primary'}">${competitor.type}</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary view-competitor" data-domain="${competitor.domain}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                    
                    // Add event listeners to view buttons
                    document.querySelectorAll('.view-competitor').forEach(button => {
                        button.addEventListener('click', function() {
                            const domain = this.getAttribute('data-domain');
                            alert(`Viewing details for ${domain}`);
                            // In a real app, this would open a modal with competitor details
                        });
                    });
                })
                .catch(error => console.error('Error fetching competitors:', error));
        }
    }

    function fetchKeywords() {
        if (document.getElementById('keywordTable')) {
            fetch('/api/keywords')
                .then(response => response.json())
                .then(data => {
                    const tableBody = document.querySelector('#keywordTable tbody');
                    tableBody.innerHTML = '';
                    
                    data.forEach(keyword => {
                        const row = document.createElement('tr');
                        const opportunityClass = keyword.opportunity === 'high' ? 'success' : 
                                               keyword.opportunity === 'medium' ? 'warning' : 'danger';
                        
                        row.innerHTML = `
                            <td>${keyword.keyword}</td>
                            <td>${keyword.volume.toLocaleString()}</td>
                            <td>${keyword.difficulty}</td>
                            <td>$${keyword.cpc.toFixed(2)}</td>
                            <td><span class="badge bg-${opportunityClass}">${keyword.opportunity}</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary analyze-keyword" data-keyword="${keyword.keyword}">
                                    <i class="fas fa-chart-bar"></i>
                                </button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                    
                    // Add event listeners to analyze buttons
                    document.querySelectorAll('.analyze-keyword').forEach(button => {
                        button.addEventListener('click', function() {
                            const keyword = this.getAttribute('data-keyword');
                            alert(`Analyzing keyword: ${keyword}`);
                            // In a real app, this would show detailed keyword analysis
                        });
                    });
                })
                .catch(error => console.error('Error fetching keywords:', error));
        }
    }

    function fetchSitemapData() {
        if (document.getElementById('sitemapTree')) {
            fetch('/api/sitemaps')
                .then(response => response.json())
                .then(data => {
                    const sitemapTree = document.getElementById('sitemapTree');
                    sitemapTree.innerHTML = `<h6>${data.domain}</h6>`;
                    
                    const ul = document.createElement('ul');
                    ul.className = 'sitemap-list';
                    
                    data.pages.forEach(page => {
                        const li = document.createElement('li');
                        li.className = `sitemap-item depth-${page.depth}`;
                        
                        const icon = page.type === 'home' ? 'fa-home' :
                                    page.type === 'category' ? 'fa-folder' :
                                    page.type === 'blog' ? 'fa-blog' : 'fa-file';
                        
                        li.innerHTML = `
                            <div class="sitemap-page">
                                <i class="fas ${icon}"></i>
                                <span class="page-url">${page.url}</span>
                                <span class="page-title">${page.title}</span>
                            </div>
                            <div class="page-actions">
                                <button class="btn btn-sm btn-outline-primary preview-page" data-url="${data.domain}${page.url}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-success add-to-plan" data-url="${data.domain}${page.url}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        `;
                        
                        ul.appendChild(li);
                    });
                    
                    sitemapTree.appendChild(ul);
                    
                    // Add event listeners to buttons
                    document.querySelectorAll('.preview-page').forEach(button => {
                        button.addEventListener('click', function() {
                            const url = this.getAttribute('data-url');
                            alert(`Previewing page: ${url}`);
                            // In a real app, this would show a preview of the page
                        });
                    });
                    
                    document.querySelectorAll('.add-to-plan').forEach(button => {
                        button.addEventListener('click', function() {
                            const url = this.getAttribute('data-url');
                            alert(`Added ${url} to content plan`);
                            // In a real app, this would add the page to a content plan
                        });
                    });
                })
                .catch(error => console.error('Error fetching sitemap data:', error));
        }
    }

    // Call the appropriate function based on the current page
    if (currentPath.includes('competitors')) {
        fetchCompetitors();
    } else if (currentPath.includes('keywords')) {
        fetchKeywords();
    } else if (currentPath.includes('sitemaps')) {
        fetchSitemapData();
    }

    // Content Generator Form
    const contentForm = document.getElementById('contentGeneratorForm');
    if (contentForm) {
        contentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const topic = document.getElementById('contentTopic').value;
            const keyword = document.getElementById('primaryKeyword').value;
            const tone = document.getElementById('contentTone').value;
            
            document.getElementById('generatingSpinner').style.display = 'block';
            
            fetch('/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: topic,
                    keyword: keyword,
                    tone: tone
                })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('generatingSpinner').style.display = 'none';
                
                // Update the content preview
                document.getElementById('contentTitle').textContent = data.title;
                
                const outlineList = document.getElementById('contentOutline');
                outlineList.innerHTML = '';
                data.outline.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    outlineList.appendChild(li);
                });
                
                document.getElementById('generatedContent').textContent = data.content;
                
                // Update SEO score
                document.getElementById('seoScore').textContent = data.seo_score;
                document.getElementById('seoScoreCircle').style.background = 
                    `conic-gradient(var(--success-color) ${data.seo_score * 3.6}deg, #e9ecef 0deg)`;
                
                // Show the content preview
                document.getElementById('contentPreview').style.display = 'block';
            })
            .catch(error => {
                document.getElementById('generatingSpinner').style.display = 'none';
                console.error('Error generating content:', error);
                alert('Error generating content. Please try again.');
            });
        });
    }

    // Rank Tracker Chart
    const rankTrackerChart = document.getElementById('rankTrackerChart');
    if (rankTrackerChart) {
        fetch('/api/rankings')
            .then(response => response.json())
            .then(data => {
                const ctx = rankTrackerChart.getContext('2d');
                
                // Prepare datasets
                const datasets = [];
                const domains = Object.keys(data.rankings);
                const colors = ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'];
                
                domains.forEach((domain, index) => {
                    const keywordData = data.rankings[domain][data.keywords[0]]; // Use first keyword by default
                    
                    datasets.push({
                        label: domain,
                        data: keywordData,
                        borderColor: colors[index % colors.length],
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderDash: domain === 'your-site.com' ? [] : [5, 5]
                    });
                });
                
                // Create chart
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: data.dates,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                reverse: true,
                                title: {
                                    display: true,
                                    text: 'Ranking Position'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            title: {
                                display: true,
                                text: `Ranking Trends for "${data.keywords[0]}"`
                            }
                        }
                    }
                });
                
                // Populate keyword filter
                const keywordFilter = document.getElementById('keywordFilter');
                if (keywordFilter) {
                    data.keywords.forEach(keyword => {
                        const option = document.createElement('option');
                        option.value = keyword;
                        option.textContent = keyword;
                        keywordFilter.appendChild(option);
                    });
                    
                    // Add event listener to filter
                    keywordFilter.addEventListener('change', function() {
                        const selectedKeyword = this.value;
                        // In a real app, this would update the chart with data for the selected keyword
                        alert(`Chart would update to show data for: ${selectedKeyword}`);
                    });
                }
            })
            .catch(error => console.error('Error fetching ranking data:', error));
    }
});
