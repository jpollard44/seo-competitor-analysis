import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-key-for-development-only')

# Routes
@app.route('/')
def dashboard():
    """Render the main dashboard with overview metrics."""
    return render_template('dashboard.html', title='Dashboard')

@app.route('/competitors')
def competitors():
    """Render the competitor finder page."""
    return render_template('competitors.html', title='Competitor Finder')

@app.route('/keywords')
def keywords():
    """Render the keyword scraper page."""
    return render_template('keywords.html', title='Keyword Scraper')

@app.route('/sitemaps')
def sitemaps():
    """Render the sitemap analyzer page."""
    return render_template('sitemaps.html', title='Sitemap Analyzer')

@app.route('/content')
def content():
    """Render the content generator page."""
    return render_template('content.html', title='Content Generator')

@app.route('/rank-tracker')
def rank_tracker():
    """Render the rank tracker page."""
    return render_template('rank_tracker.html', title='Rank Tracker')

# API Routes
@app.route('/api/competitors', methods=['GET', 'POST'])
def api_competitors():
    """API endpoint for competitor data."""
    if request.method == 'POST':
        # Process competitor data (would connect to actual API in production)
        data = request.json
        # Mock response for development
        return jsonify({'status': 'success', 'message': 'Competitor data processed'})
    else:
        # Return mock competitor data for development
        mock_data = [
            {'domain': 'competitor1.com', 'traffic': 250000, 'overlap': 65, 'da': 45, 'type': 'seo'},
            {'domain': 'competitor2.com', 'traffic': 180000, 'overlap': 42, 'da': 38, 'type': 'product'},
            {'domain': 'competitor3.com', 'traffic': 320000, 'overlap': 78, 'da': 52, 'type': 'seo'},
        ]
        return jsonify(mock_data)

@app.route('/api/keywords', methods=['GET', 'POST'])
def api_keywords():
    """API endpoint for keyword data."""
    if request.method == 'POST':
        # Process keyword data (would connect to actual API in production)
        data = request.json
        # Mock response for development
        return jsonify({'status': 'success', 'message': 'Keyword data processed'})
    else:
        # Return mock keyword data for development
        mock_data = [
            {'keyword': 'seo tools', 'volume': 12000, 'difficulty': 67, 'cpc': 15.20, 'opportunity': 'medium'},
            {'keyword': 'competitor analysis', 'volume': 8500, 'difficulty': 45, 'cpc': 12.75, 'opportunity': 'high'},
            {'keyword': 'keyword research', 'volume': 22000, 'difficulty': 72, 'cpc': 18.50, 'opportunity': 'medium'},
        ]
        return jsonify(mock_data)

@app.route('/api/sitemaps', methods=['GET', 'POST'])
def api_sitemaps():
    """API endpoint for sitemap data."""
    if request.method == 'POST':
        # Process sitemap data (would connect to actual API in production)
        data = request.json
        # Mock response for development
        return jsonify({'status': 'success', 'message': 'Sitemap data processed'})
    else:
        # Return mock sitemap data for development
        mock_data = {
            'domain': 'competitor1.com',
            'pages': [
                {'url': '/home', 'type': 'home', 'depth': 1, 'title': 'Home Page'},
                {'url': '/products', 'type': 'category', 'depth': 1, 'title': 'Products'},
                {'url': '/blog', 'type': 'blog', 'depth': 1, 'title': 'Blog'},
                {'url': '/blog/seo-tips', 'type': 'post', 'depth': 2, 'title': 'SEO Tips'},
            ]
        }
        return jsonify(mock_data)

@app.route('/api/content', methods=['POST'])
def api_content():
    """API endpoint for content generation."""
    data = request.json
    # Mock response for development (would connect to AI API in production)
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

@app.route('/api/rankings', methods=['GET'])
def api_rankings():
    """API endpoint for ranking data."""
    # Mock ranking data for development
    mock_data = {
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
    return jsonify(mock_data)

if __name__ == '__main__':
    # Use environment variables for host and port with defaults
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true')
