import { useState } from 'react';
import { patientAPI } from '../../services/api';

const symptomsList = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Vomiting',
  'Diarrhea', 'Body Pain', 'Sore Throat', 'Shortness of Breath', 'Chest Pain', 'Dizziness'
];

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    try {
      const response = await patientAPI.symptomChecker(selectedSymptoms);
      setResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Symptom Checker</h2>

      {!result ? (
        <>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Your Symptoms</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {symptomsList.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-primary-100 border-primary-500 text-primary-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-primary-300'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={reset}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={checkSymptoms}
              disabled={selectedSymptoms.length === 0 || loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Check Symptoms'}
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Possible Conditions</h3>
              <button
                onClick={reset}
                className="text-primary-600 hover:text-primary-700"
              >
                Check Again
              </button>
            </div>

            {result.possibleDiseases.length > 0 ? (
              <div className="space-y-3">
                {result.possibleDiseases.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      index === 0 ? 'bg-red-50 border-red-200' :
                      index === 1 ? 'bg-orange-50 border-orange-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.disease}</h4>
                        <p className="text-sm text-gray-600">
                          Matched {item.matchCount} of {result.selectedSymptoms.length} symptoms
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${
                          item.probability >= 75 ? 'text-red-600' :
                          item.probability >= 50 ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {item.probability}%
                        </span>
                        <p className="text-xs text-gray-500">probability</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {result.selectedSymptoms.slice(0, 4).map((sym, i) => (
                        <span key={i} className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No matching conditions found</p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  This is a basic symptom checker and should not be used as a substitute for professional medical advice.
                  Please consult a doctor for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;

