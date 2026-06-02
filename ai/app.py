import os

import numpy as np
import tensorflow as tf
from fastapi import FastAPI
from pydantic import BaseModel, Field


@tf.keras.utils.register_keras_serializable()
class CustomDenseLayer(tf.keras.layers.Layer):
    def __init__(self, units, activation=None, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.activation = tf.keras.activations.get(activation)

    def build(self, input_shape):
        self.w = self.add_weight(
            shape=(input_shape[-1], self.units),
            initializer="random_normal",
            trainable=True,
            name="custom_weight",
        )
        self.b = self.add_weight(
            shape=(self.units,),
            initializer="zeros",
            trainable=True,
            name="custom_bias",
        )

    def call(self, inputs):
        output = tf.matmul(inputs, self.w) + self.b
        if self.activation is not None:
            output = self.activation(output)
        return output

    def get_config(self):
        config = super().get_config()
        config.update(
            {
                "units": self.units,
                "activation": tf.keras.activations.serialize(self.activation),
            }
        )
        return config


app = FastAPI(title="Financial Profile Segmentation API")
model = tf.keras.models.load_model(
    "risk_profile_model.keras",
    custom_objects={"CustomDenseLayer": CustomDenseLayer},
)

FEATURE_MEAN = np.array(
    [
        0.45176972948820804,
        0.537540627742612,
        0.27542985046291546,
        0.4752774800398317,
        0.47525,
        36.045,
        10.497223271588163,
        41.066,
        14.65175,
    ],
    dtype=np.float32,
)
FEATURE_SCALE = np.array(
    [
        0.272940065593388,
        0.25597174717959814,
        0.19608984099916432,
        0.24849414368629782,
        0.6843883674493568,
        17.144619418348118,
        4.3510019074635045,
        13.50128305014009,
        8.72848623402136,
    ],
    dtype=np.float32,
)

PROFILE_NAMES = {
    0: "Financially Stable",
    1: "Moderate Financial Capacity",
    2: "Financially Vulnerable",
}

PROFILE_NOTE = (
    "Cluster merupakan hasil segmentasi tanpa label (unsupervised learning) "
    "dan tidak merepresentasikan risiko gagal bayar aktual maupun keputusan kredit resmi."
)


class FinancialProfileInput(BaseModel):
    age: float
    annual_income: float = Field(gt=0)
    loan_amount: float
    loan_duration_months: float
    interest_rate: float
    debt_to_income_ratio: float
    monthly_expenses: float
    savings_balance: float
    employment_stability_years: float
    previous_default_count: float


@app.get("/")
def root():
    return {"message": "Financial Profile Segmentation API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(payload: FinancialProfileInput):
    loan_to_income_ratio = payload.loan_amount / payload.annual_income
    expenses_to_income_ratio = payload.monthly_expenses / (payload.annual_income / 12)
    savings_to_income_ratio = payload.savings_balance / payload.annual_income

    features = np.array(
        [
            [
                loan_to_income_ratio,
                expenses_to_income_ratio,
                savings_to_income_ratio,
                payload.debt_to_income_ratio,
                payload.previous_default_count,
                payload.loan_duration_months,
                payload.interest_rate,
                payload.age,
                payload.employment_stability_years,
            ]
        ],
        dtype=np.float32,
    )
    features = (features - FEATURE_MEAN) / FEATURE_SCALE

    prediction = model.predict(features, verbose=0)
    segment_membership_scores = prediction[0].tolist()
    predicted_label = int(np.argmax(prediction, axis=1)[0])

    return {
        "financial_profile_label": predicted_label,
        "profile_name": PROFILE_NAMES.get(
            predicted_label,
            f"Financial Profile {predicted_label}",
        ),
        "segment_membership_scores": segment_membership_scores,
        "note": PROFILE_NOTE,
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
