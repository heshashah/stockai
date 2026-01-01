from sklearn.ensemble import RandomForestClassifier

def train_rf_model(df, feature_cols):
    X = df[feature_cols]
    y = df["Label"]

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_split=5
    )
    model.fit(X, y)
    return model
