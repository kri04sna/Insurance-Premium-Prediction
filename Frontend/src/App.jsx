import { useState } from 'react'
import { predictInsurance } from './api';
import {
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ArrowRight,
  User,
  Briefcase,
  Weight,
  Ruler,
  CigaretteOff,
  Calculator,
  BarChart3,
  Lock,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    income_lpa: '',
    smoker: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

    // Stores prediction received from the ML backend
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  // Tracks API request status
  const [loading, setLoading] = useState(false);

  // Stores errors received during API communication
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSubmitted(false)
    setPrediction(null);
    setConfidence(null);
    setApiError('');
  }

  const bmi =
    formData.weight && formData.height
      ? (Number(formData.weight) / (Number(formData.height) / 100) ** 2).toFixed(2)
      : null

 const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  const age = Number(formData.age);
  const weight = Number(formData.weight);
  const height = Number(formData.height);
  const income = Number(formData.income_lpa);

  // Validate user inputs
  if (!formData.age || age < 1 || age > 119) {
    newErrors.age = 'Age must be between 1 and 119 years.';
  }

  if (!formData.income_lpa || income <= 0) {
    newErrors.income_lpa = 'Enter a valid annual income.';
  }

  if (!formData.weight || weight <= 0) {
    newErrors.weight = 'Weight must be greater than zero.';
  }

  if (!formData.height || height <= 0 || height >= 250) {
    newErrors.height = 'Height must be between 1 and 249 cm.';
  }

  if (!formData.smoker) {
    newErrors.smoker = 'Please select your smoking status.';
  }

  setErrors(newErrors);
  setSubmitted(false);
  setPrediction(null);
  setApiError('');

  // Stop if validation fails
  if (Object.keys(newErrors).length > 0) {
    return;
  }

  // Prepare data for FastAPI
  const payload = {
    age: age,
    weight: weight,
    height: height,
    income_lpa: income,
    smoker: formData.smoker === 'true'
  };

  // Send data to the backend
  try {
    setLoading(true);

    const result = await predictInsurance(payload);

    setPrediction(result.response.predicted_category);
    setConfidence(result.response.confidence);

    setSubmitted(true);

  } catch (error) {
  setApiError(
    'Unable to connect to the server. Please try again later.'
  );

  console.error('Prediction error:', error);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app" id="home">
      {/* Navbar */}
      <header className="navbar">
        <a href="#home" className="logo">
          <ShieldCheck size={26} strokeWidth={2.4} />
          <span>Insure</span>
          <span className="logo-accent">Predict</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#prediction" className="nav-btn">
            Prediction
          </a>
        </nav>
      </header>

      <main className="main">
        {/* Left: hero */}
        <section className="hero">
          <span className="badge">
            <Sparkles size={14} />
            Smart Insurance Estimation
          </span>

          <h1>
            Understand Your
            <span>Insurance Premium Category.</span>
          </h1>

          <p className="description">
            Get an estimated insurance premium category based on your personal
            and lifestyle information.
          </p>

          <div className="feature-cards" id="about">
            <div className="feature-card">
              <ShieldCheck size={26} strokeWidth={1.8} />
              <h3>Personalized Estimate</h3>
              <p>Based on your key details</p>
            </div>
            <div className="feature-card">
              <Zap size={26} strokeWidth={1.8} />
              <h3>Quick &amp; Easy</h3>
              <p>Get results in seconds</p>
            </div>
          </div>

          <div className="trust-row">
            <span>
              <CheckCircle2 size={16} className="green" /> No registration required
            </span>
            <span>
              <Lock size={16} /> Your data is private
            </span>
            <span>
              <BarChart3 size={16} /> Simple and reliable
            </span>
          </div>
        </section>

        {/* Right: form */}
        <section className="form-wrap" id="prediction">
          <form className="prediction-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div className="form-title">
                <span className="form-icon">
                  <ShieldCheck size={20} />
                </span>
                <h2>Insurance Category Prediction</h2>
              </div>
              <p>Enter your details to get your estimated insurance category.</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="age">
                  <User size={15} /> Age (years)
                </label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="119"
                  required
                />

                {errors.age && (
                    <small className="error-message">{errors.age}</small>
                  )}
              </div>

              <div className="form-group">
                <label htmlFor="income_lpa">
                  <Briefcase size={15} /> Annual Income (LPA)
                </label>
                <input
                  id="income_lpa"
                  type="number"
                  name="income_lpa"
                  placeholder="e.g. 10"
                  value={formData.income_lpa}
                  onChange={handleChange}
                  min="0.01"
                  step="any"
                  required
                />

                {errors.income_lpa && (
                  <small className="error-message">{errors.income_lpa}</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="weight">
                  <Weight size={15} /> Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0.1"
                  step="any"
                  required
                />

                {errors.weight && (
                    <small className="error-message">{errors.weight}</small>
                  )}
              </div>

              <div className="form-group">
                <label htmlFor="height">
                  <Ruler size={15} /> Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  name="height"
                  placeholder="Enter height"
                  value={formData.height}
                  onChange={handleChange}
                  min="1"
                  max="249"
                  step="any"
                  required
                />

                {errors.height && (
                  <small className="error-message">{errors.height}</small>
                )}
              </div>
            </div>

            <div className="form-group smoker-group">
              <label>
                <CigaretteOff size={15} /> Smoking Status
              </label>
              <div className="radio-options">
                <label className="radio-card">
                  <input
                    type="radio"
                    name="smoker"
                    value="true"
                    checked={formData.smoker === 'true'}
                    onChange={handleChange}
                    required
                  />

                  <span>Yes, I smoke</span>
                </label>
                <label className="radio-card">
                  <input
                    type="radio"
                    name="smoker"
                    value="false"
                    checked={formData.smoker === 'false'}
                    onChange={handleChange}
                  />
                  <span>No, I don't smoke</span>
                </label>
              </div>
            </div>

            <div className="bmi-preview">
              <span>
                <Calculator size={16} /> Your calculated BMI
              </span>
              <strong>{bmi ?? '--'}</strong>
            </div>  
             {errors.smoker && (
                <small className="error-message">{errors.smoker}</small>
               )}
              <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
              <BarChart3 size={18} />
              {loading ? 'Predicting...' : 'Predict My Insurance Category'}
              <ArrowRight size={18} />
            </button>
                {apiError && (
                <div className="api-error">
                  <AlertCircle size={20} />
                  <div>
                    <strong>Connection Error</strong>
                    <p>{apiError}</p>
                  </div>
                </div>
              )}

           {submitted && (
          <div className="result-card">
            <div className="result-header">
              <h3>Your Prediction Result</h3>
              <span className="result-status">Ready for prediction</span>
            </div>

              <div className={`result-category ${
                    prediction ? `category-${prediction.toLowerCase()}` : ''
                  }`}>
                <p>Insurance Premium Category</p>

                  <h2>{prediction || 'Pending'}</h2>

                <span>
                  {prediction
                    ? 'Your insurance premium category has been predicted successfully.'
                    : 'Connect the prediction model to see your result.'}
                </span>
                  {prediction && confidence !== null && (
                    <div className="confidence-section">
                      <div className="confidence-header">
                        <span>Model Confidence</span>
                        <strong>{(confidence * 100).toFixed(1)}%</strong>
                      </div>

                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
              </div>

              <div className="result-details">
                <div>
                  <span>Age</span>
                  <strong>{formData.age} years</strong>
                </div>
                <div>
                  <span>BMI</span>
                  <strong>{bmi}</strong>
                </div>
                <div>
                  <span>Annual Income</span>
                  <strong>{formData.income_lpa} LPA</strong>
                </div>
                <div>
                  <span>Smoking Status</span>
                  <strong>{formData.smoker === 'true' ? 'Smoker' : 'Non-smoker'}</strong>
                </div>
              </div>
            </div>
          )}

            <p className="privacy-note">
              <Lock size={13} /> Your information is used only for this estimation.
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default App
