import { useEffect, useState, useCallback } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: "",
    status: "ACTIVE",
  });

  const API_BASE = "http://localhost:3000/api/item";

  const fetchItems = useCallback(async (currentPage) => {
    try {
      const result = await fetch(`${API_BASE}?page=${currentPage}`); 
      const json = await result.json();
      setItems(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems(page);
  }, [page, fetchItems]);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setFormData({ itemName: "", itemCategory: "", itemPrice: "", status: "ACTIVE" });
    setEditingId(null);
    fetchItems(page);
  }

  async function handleDelete(id) {
    if (confirm("Delete this item?")) {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      fetchItems(page);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setFormData({
      itemName: item.itemName,
      itemCategory: item.itemCategory,
      itemPrice: item.itemPrice,
      status: item.status
    });
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Item Management System</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input placeholder="Name" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} required />
        <input placeholder="Category" value={formData.itemCategory} onChange={(e) => setFormData({...formData, itemCategory: e.target.value})} required />
        <input placeholder="Price" type="number" value={formData.itemPrice} onChange={(e) => setFormData({...formData, itemPrice: e.target.value})} required />
        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <table border="1" width="100%" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0", color: "black" }}>
            <th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>{item.itemPrice}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={{ color: "red" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span style={{ margin: "0 10px" }}>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default App;