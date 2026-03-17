import { useState } from "react";
import ProteinService from "../services/ProteinService";

function AddProtein() {
  const [user, setUser] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    goal: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await ProteinService.create(user);
      alert("User Added Successfully");
    } catch (err) {
      console.log("Error adding user:", err);
      const backendMessage =
        err?.response?.data?.message || err?.message || "Unknown error";
      alert(`Failed to add user: ${backendMessage}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Protein User</h3>
      <form onSubmit={saveUser}>
        <input name="name" placeholder="Name" className="form-control mb-2" onChange={handleChange} />
        <input name="age" placeholder="Age" className="form-control mb-2" onChange={handleChange} />
        <input name="weight" placeholder="Weight" className="form-control mb-2" onChange={handleChange} />
        <input name="height" placeholder="Height" className="form-control mb-2" onChange={handleChange} />
        <input name="goal" placeholder="Goal (bulking/cutting)" className="form-control mb-2" onChange={handleChange} />
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}

export default AddProtein;
