import React, { useEffect, useState } from "react";
import ProteinService from "../services/ProteinService";

function ProteinList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    goal: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ProteinService.getAll();
      setUsers(response.data);
    } catch (err) {
      console.log("Error fetching users:", err);
      const backendMessage =
        err?.response?.data?.message || err?.message || "Unknown error";
      const message = `Unable to load users: ${backendMessage}`;
      setError(message);
      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: "",
      age: "",
      weight: "",
      height: "",
      goal: ""
    });
    setShowForm(true);
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      age: user.age,
      weight: user.weight,
      height: user.height,
      goal: user.goal
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name || !formData.age || !formData.weight || !formData.height || !formData.goal) {
      const message = "Please fill all fields";
      setError(message);
      window.alert(message);
      return;
    }

    if (editingId) {
      try {
        await ProteinService.updatePartial(editingId, formData);
        setSuccessMessage("User updated successfully");
        setShowForm(false);
        fetchUsers();
      } catch (err) {
        const backendMessage =
          err?.response?.data?.message || err?.message || "Unknown error";
        window.alert(`Failed to update user: ${backendMessage}`);
      }
    } else {
      try {
        await ProteinService.create(formData);
        setSuccessMessage("User added successfully");
        setShowForm(false);
        fetchUsers();
      } catch (err) {
        const backendMessage =
          err?.response?.data?.message || err?.message || "Unknown error";
        window.alert(`Failed to create user: ${backendMessage}`);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  // ⭐⭐⭐⭐⭐ PASSWORD DELETE LOGIC ⭐⭐⭐⭐⭐
  const deleteUser = async (id) => {

    const password = window.prompt("Enter Password to Delete");

    if (password !== "2005") {
      window.alert("❌ Wrong Password! Delete Cancelled");
      return;
    }

    if (window.confirm("Are you sure you want to delete this user?")) {
      setError("");
      setSuccessMessage("");
      try {
        await ProteinService.delete(id);
        setSuccessMessage("User deleted successfully");
        fetchUsers();
      } catch (err) {
        const backendMessage =
          err?.response?.data?.message || err?.message || "Unknown error";
        window.alert(`Failed to delete user: ${backendMessage}`);
      }
    }
  };
  // ⭐⭐⭐⭐⭐ END ⭐⭐⭐⭐⭐

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Users & Protein Requirements</h2>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5>{editingId ? "Edit User" : "Add New User"}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <input className="form-control mb-2" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange}/>
              <input className="form-control mb-2" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange}/>
              <input className="form-control mb-2" name="weight" placeholder="Weight" value={formData.weight} onChange={handleInputChange}/>
              <input className="form-control mb-2" name="height" placeholder="Height" value={formData.height} onChange={handleInputChange}/>
              <select className="form-control mb-2" name="goal" value={formData.goal} onChange={handleInputChange}>
                <option value="">Select Goal</option>
                <option value="bulking">Bulking</option>
                <option value="cutting">Cutting</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <button className="btn btn-success me-2">
                {editingId ? "Update" : "Add"}
              </button>

              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="btn btn-primary mb-4" onClick={handleAddClick}>
          + Add New User
        </button>
      )}

      <h3>Users List</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Protein</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.proteinRequired?.toFixed(2)}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(user)}>
                    Edit
                  </button>

                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}

export default ProteinList;