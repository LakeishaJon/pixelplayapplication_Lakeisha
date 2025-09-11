import { Link } from 'react-router-dom';

export const StoryTemplates = () => {
  const templates = [
    { id: 1, title: "Hero's Journey", genre: "Adventure", description: "Classic hero adventure template" },
    { id: 2, title: "Mystery Solver", genre: "Mystery", description: "Detective story template" },
    { id: 3, title: "Space Explorer", genre: "Sci-Fi", description: "Space adventure template" }
  ];

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-white">Story Templates</h1>
            <p className="text-white-50">Choose from pre-made story structures</p>
          </div>
          <Link to="/dashboard" className="btn btn-outline-light">Back to Dashboard</Link>
        </div>
        
        <div className="row">
          {templates.map(template => (
            <div key={template.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{template.title}</h5>
                  <span className="badge bg-primary mb-2">{template.genre}</span>
                  <p className="card-text">{template.description}</p>
                  <button className="btn btn-primary">Use Template</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}