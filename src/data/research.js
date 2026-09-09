export const sepsisReport = {
  title: 'An Interpretable Machine Learning Approach for Early Sepsis Detection in ICUs',
  authors: ['Adam Mantello', 'Jongho Park', 'Ken Liu', 'Tina Cheng'],
  source: 'ML4Health_report_1.pdf',
  course: 'COMP90089 · Final report',
  // Transcribed ROC-AUC only: other columns include an unresolved F1 inconsistency.
  results: [
    { model: 'Logistic regression', twoHour: '0.569', fourHour: '0.645' },
    { model: 'Logistic regression + SMOTETomek', twoHour: '0.553', fourHour: '0.637' },
    { model: 'GAM', twoHour: '0.610', fourHour: '0.646' },
    { model: 'GAM + SMOTETomek', twoHour: '0.589', fourHour: '0.601' },
    { model: 'XGBoost', twoHour: '0.603', fourHour: '0.650' },
    { model: 'XGBoost + SMOTETomek', twoHour: '0.631', fourHour: '0.568' },
  ],
};
