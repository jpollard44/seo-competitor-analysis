from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Mock data
competitors = [
    {'domain': 'competitor1.com', 'traffic': 250000, 'overlap': 65, 'da': 45, 'type': 'seo'},
    {'domain': 'competitor2.com', 'traffic': 180000, 'overlap': 42, 'da': 38, 'type': 'product'},
    {'domain': 'competitor3.com', 'traffic': 320000, 'overlap': 78, 'da': 52, 'type': 'seo'},
]

keywords = [
    {'keyword': 'seo tools', 'volume': 12000, 'difficulty': 67, 'cpc': 15.20, 'opportunity': 'medium'},
    {'keyword': 'competitor analysis', 'volume': 8500, 'difficulty': 45, 'cpc': 12.75, 'opportunity': 'high'},
    {'keyword': 'keyword research', 'volume': 22000, 'difficulty': 72, 'cpc': 18.50, 'opportunity': 'medium'},
]

# Routes
@app.route('/')
def dashboard():
    return render_template('dashboard.html', title='Dashboard')

@app.route('/competitors')
def competitors_page():
    return render_template('competitors.html', title='Competitor Finder')

@app.route('/keywords')
def keywords_page():
    return render_template('keywords.html', title='Keyword Scraper')

@app.route('/sitemaps')
def sitemaps_page():
    return render_template('sitemaps.html', title='Sitemap Analyzer')

@app.route('/content')
def content_page():
    return render_template('content.html', title='Content Generator')

@app.route('/rank-tracker')
def rank_tracker_page():
    return render_template('rank_tracker.html', title='Rank Tracker')

# API Routes
@app.route('/api/competitors')
def api_competitors():
    return jsonify(competitors)

@app.route('/api/keywords')
def api_keywords():
    return jsonify(keywords)

@app.route('/api/sitemaps')
def api_sitemaps():
    sitemap_data = {
        'domain': 'competitor1.com',
        'pages': [
            {'url': '/home', 'type': 'home', 'depth': 1, 'title': 'Home Page'},
            {'url': '/products', 'type': 'category', 'depth': 1, 'title': 'Products'},
            {'url': '/blog', 'type': 'blog', 'depth': 1, 'title': 'Blog'},
            {'url': '/blog/seo-tips', 'type': 'post', 'depth': 2, 'title': 'SEO Tips'},
        ]
    }
    return jsonify(sitemap_data)

@app.route('/api/content', methods=['POST'])
def api_content():
    mock_response = {
        'title': 'How to Analyze Your SEO Competitors',
        'outline': [
            'Introduction to SEO Competitor Analysis',
            'Why Competitor Analysis Matters',
            'Step-by-Step Guide to Analyzing Competitors',
            'Tools for Effective Competitor Research',
            'Actionable Insights from Competitor Data'
        ],
        'content': 'This is a placeholder for AI-generated content. In production, this would be actual content generated based on the input parameters.',
        'seo_score': 85
    }
    return jsonify(mock_response)

@app.route('/api/rankings')
def api_rankings():
    ranking_data = {
        'dates': ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01'],
        'keywords': ['seo tools', 'competitor analysis', 'keyword research'],
        'rankings': {
            'your-site.com': {
                'seo tools': [12, 8, 5, 3],
                'competitor analysis': [15, 12, 10, 7],
                'keyword research': [20, 18, 15, 10]
            },
            'competitor1.com': {
                'seo tools': [3, 4, 4, 5],
                'competitor analysis': [5, 6, 8, 9],
                'keyword research': [7, 8, 9, 12]
            }
        }
    }
    return jsonify(ranking_data)

if __name__ == '__main__':
    app.run(debug=True)
