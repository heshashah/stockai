import numpy as np

def hybrid_predict(rf_model, lstm_model, features, sequence):
    # RF Prediction
    rf_pred = rf_model.predict([features])[0]
    rf_prob = rf_model.predict_proba([features])[0].max()

    # LSTM Prediction
    seq = sequence.reshape((1, sequence.shape[0], 1))
    lstm_output = lstm_model.predict(seq)[0]
    lstm_pred = np.argmax(lstm_output)
    lstm_prob = lstm_output[lstm_pred]

    # Final Score Fusion
    final_score = 0.4 * rf_prob + 0.6 * lstm_prob

    # Decision mapping
    decision_map = {0: "HOLD", 1: "BUY", 2: "SELL"}

    return {
        "rf_decision": rf_pred,
        "lstm_decision": lstm_pred,
        "final_score": round(float(final_score), 3),
        "final_decision": decision_map[lstm_pred]
    }
