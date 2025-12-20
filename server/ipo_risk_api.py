import sys, json
from risk_model import calculate_risk

data = json.loads(sys.stdin.read())
result = calculate_risk(data)
print(json.dumps(result))
