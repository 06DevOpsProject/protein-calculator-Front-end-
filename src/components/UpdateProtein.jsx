import React, { useState } from "react";
import ProteinService from "../services/ProteinService";

function UpdateProtein({ selectedUser, refresh }) {

  const [user, setUser] = useState(selectedUser);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    try {
      await ProteinService.updatePartial(user.id, user);
      alert("Updated successfully");
      refresh();
    } catch (err) {
      console.log(err);
    }
  };

  if (!selectedUser) return null;

  return (
    <div>
      <h2>Update Protein User</h2>

      <input name="name" placeholder="Name" value={user.name} onChange={handleChange} />
      <input name="age" placeholder="Age" value={user.age} onChange={handleChange} />
      <input name="weight" placeholder="Weight (kg)" value={user.weight} onChange={handleChange} />
      <input name="height" placeholder="Height (cm)" value={user.height} onChange={handleChange} />
      <input name="goal" placeholder="Goal" value={user.goal} onChange={handleChange} />
      <input
        name="proteinRequired"
        placeholder="Protein Required (g)"
        value={user.proteinRequired}
        onChange={handleChange}
      />

      <br /><br />
      <button onClick={updateUser}>Update</button>
    </div>
  );
}

export default UpdateProtein;
