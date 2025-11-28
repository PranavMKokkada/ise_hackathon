from scipy.optimize import linprog
import numpy as np

def optimize_redistribution(supply_nodes, demand_nodes):
    """
    Solve redistribution optimization: minimize shortages and cost.
    Simple transportation problem example.
    """
    # Example: 2 Supply Nodes (Capacities), 2 Demand Nodes (Requirements)
    # Supply: [Warehouse A (100), Warehouse B (50)]
    # Demand: [Hospital 1 (80), Hospital 2 (60)]
    # Cost Matrix:
    #       H1  H2
    # WA    2   4
    # WB    5   3
    
    # Objective: Minimize sum(cost * flow)
    c = [2, 4, 5, 3] # Flattened cost matrix
    
    # Constraints
    # Supply constraints: WA_H1 + WA_H2 <= 100, WB_H1 + WB_H2 <= 50
    A_ub = [
        [1, 1, 0, 0],
        [0, 0, 1, 1]
    ]
    b_ub = [100, 50]
    
    # Demand constraints: WA_H1 + WB_H1 >= 80, WA_H2 + WB_H2 >= 60
    # (Multiplied by -1 for <= form)
    A_ub_demand = [
        [-1, 0, -1, 0],
        [0, -1, 0, -1]
    ]
    b_ub_demand = [-80, -60]
    
    # Combine constraints
    A = np.vstack([A_ub, A_ub_demand])
    b = np.concatenate([b_ub, b_ub_demand])
    
    # Bounds (flow >= 0)
    x_bounds = (0, None)
    
    res = linprog(c, A_ub=A, b_ub=b, bounds=[x_bounds]*4, method='highs')
    
    if res.success:
        return {
            "status": "OPTIMAL",
            "plan": {
                "Warehouse_A_to_Hospital_1": res.x[0],
                "Warehouse_A_to_Hospital_2": res.x[1],
                "Warehouse_B_to_Hospital_1": res.x[2],
                "Warehouse_B_to_Hospital_2": res.x[3]
            },
            "total_cost": res.fun
        }
    else:
        return {"status": "FAILED", "message": res.message}
