import React, { useEffect, useState } from "react";
import ProteinService from "../services/ProteinService";

function ProteinList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchUsers = () => {
    setLoading(true);
    setError("");
    ProteinService.getAll()
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching users:", err);
        setError(
          "Unable to load users. Please check that the backend service is running and reachable."
        );
        setLoading(false);
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.weight || !formData.height || !formData.goal) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      // Update user
      ProteinService.updatePartial(editingId, formData)
        .then(() => {
          alert("User updated successfully");
          setShowForm(false);
          fetchUsers();
        })
        .catch((err) => {
          console.log("Error updating user:", err);
          setError(
            err?.response?.data?.message ||
              "Failed to update user. Please try again later."
          );
          alert("Failed to update user");
        });
    } else {
      // Create user
      ProteinService.create(formData)
        .then(() => {
          alert("User added successfully");
          setShowForm(false);
          fetchUsers();
        })
        .catch((err) => {
          console.log("Error creating user:", err);
          setError(
            err?.response?.data?.message ||
              "Failed to create user. Please check your input or try again later."
          );
          alert("Failed to create user");
        });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      ProteinService.delete(id)
        .then(() => {
          alert("User deleted successfully");
          fetchUsers();
        })
        .catch((err) => {
          console.log("Error deleting user:", err);
          setError(
            err?.response?.data?.message ||
              "Failed to delete user. Please try again later."
          );
          alert("Failed to delete user");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Protein Calculator</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5>{editingId ? "Edit User" : "Add New User"}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter age"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter weight"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Enter height"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Goal</label>
                <select
                  className="form-control"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                >
                  <option value="">Select Goal</option>
                  <option value="bulking">Bulking</option>
                  <option value="cutting">Cutting</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Update" : "Add"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!showForm && (
        <button className="btn btn-primary mb-4" onClick={handleAddClick}>
          + Add New User
        </button>
      )}

      {/* Users Table */}
      <h3>Users List</h3>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-muted">No users found. Click "Add New User" to create one.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>Goal</th>
                <th>Protein Required (g)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.weight}</td>
                  <td>{user.height}</td>
                  <td>{user.goal}</td>
                  <td><strong>{user.proteinRequired?.toFixed(2)}</strong></td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProteinList;
