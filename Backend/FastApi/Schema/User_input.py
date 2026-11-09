from pydantic import BaseModel, Field, computed_field   
from typing import Annotated, Literal

 # pydantic model to validate incoming data
class UserInput(BaseModel):
    age: Annotated[int,Field(..., gt=0, lt=120, description="Age of the user")]

    weight: Annotated[float,Field(..., gt=0, description="Weight of the user in kg")]

    height: Annotated[float,Field(..., gt=0, lt=250, description="Height of the user in cm") ]

    income_lpa: Annotated[float, Field(..., gt=0, description="Annual salary of the user in LPA")]
    smoker: Annotated[bool,Field(..., description="Is the user a smoker?") ]

    @computed_field
    @property
    def bmi(self) -> float:
        return round(
            self.weight / ((self.height / 100) ** 2), 2
        )