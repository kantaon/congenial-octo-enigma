import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './AdminPanel.css'

const materialPrimaryFilters = [
  { id: 'lamino', label: 'Lamino' },
  { id: 'dyha', label: 'Dýha' },
  { id: 'vysoky-lesk', label: 'Vysoký lesk' },
  { id: 'lacobel', label: 'Lacobel' },
  { id: 'mramor', label: 'Mramor' },
]

const materialSecondaryFilters = [
  { id: 'vse', label: 'Vše' },
  { id: 'drevo', label: 'Dřevo' },
  { id: 'barva', label: 'Barva' },
  { id: 'kamen', label: 'Kámen' },
  { id: 'kov', label: 'Kov' },
]

function AdminPanel({ onBack, customSwatches, onSwatchesChange }) {
  const [formData, setFormData] = useState({
    id: '',
    label: '',
    color: '#ffffff',
    imageUrl: '',
    categories: [],
  })
  const [editingId, setEditingId] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId]
      return { ...prev, categories }
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      setPreviewImage(base64String)
      setFormData((prev) => ({ ...prev, imageUrl: base64String }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.label || !formData.color) {
      alert('Vyplňte název a barvu dekoru.')
      return
    }

    if (formData.categories.length === 0) {
      alert('Vyberte alespoň jednu kategorii.')
      return
    }

    const generatedId = formData.id || `custom-${Date.now()}`
    const newSwatch = {
      ...formData,
      id: generatedId,
    }

    let updatedSwatches
    if (editingId) {
      updatedSwatches = customSwatches.map((s) => (s.id === editingId ? newSwatch : s))
      setEditingId(null)
    } else {
      updatedSwatches = [...customSwatches, newSwatch]
    }

    onSwatchesChange(updatedSwatches)
    resetForm()
  }

  const handleEdit = (swatch) => {
    setFormData(swatch)
    setPreviewImage(swatch.imageUrl || null)
    setEditingId(swatch.id)
  }

  const handleDelete = (id) => {
    if (!confirm('Opravdu chcete smazat tento dekor?')) return
    const updatedSwatches = customSwatches.filter((s) => s.id !== id)
    onSwatchesChange(updatedSwatches)
  }

  const resetForm = () => {
    setFormData({
      id: '',
      label: '',
      color: '#ffffff',
      imageUrl: '',
      categories: [],
    })
    setPreviewImage(null)
    setEditingId(null)
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-header__left">
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            ← Zpět do konfiguratoru
          </button>
          <h1>Admin - Správa Dekorů</h1>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-form-section">
          <h2>{editingId ? 'Upravit dekor' : 'Přidat nový dekor'}</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="label">Název dekoru *</label>
              <input
                type="text"
                id="label"
                value={formData.label}
                onChange={(e) => handleInputChange('label', e.target.value)}
                placeholder="např. Dub přírodní"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Základní barva *</label>
              <div className="color-picker-group">
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="#ffffff"
                  pattern="^#[0-9A-Fa-f]{6}$"
                />
              </div>
              <small>Základní barva pro 3D náhled</small>
            </div>

            <div className="form-group">
              <label htmlFor="image">Textura / Obrázek (volitelné)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Náhled" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Primární kategorie *</label>
              <div className="checkbox-group">
                {materialPrimaryFilters.map((filter) => (
                  <label key={filter.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(filter.id)}
                      onChange={() => handleCategoryToggle(filter.id)}
                    />
                    {filter.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Sekundární kategorie</label>
              <div className="checkbox-group">
                {materialSecondaryFilters.map((filter) => (
                  <label key={filter.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(filter.id)}
                      onChange={() => handleCategoryToggle(filter.id)}
                    />
                    {filter.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-actions">
              {editingId && (
                <button type="button" className="btn btn--ghost" onClick={resetForm}>
                  Zrušit úpravu
                </button>
              )}
              <button type="submit" className="btn btn--primary">
                {editingId ? 'Uložit změny' : 'Přidat dekor'}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-list-section">
          <h2>Vlastní dekory ({customSwatches.length})</h2>
          {customSwatches.length === 0 ? (
            <p className="empty-state">Zatím nemáte žádné vlastní dekory.</p>
          ) : (
            <div className="swatch-list">
              {customSwatches.map((swatch) => (
                <div key={swatch.id} className="swatch-item">
                  <div className="swatch-preview">
                    {swatch.imageUrl ? (
                      <img src={swatch.imageUrl} alt={swatch.label} />
                    ) : (
                      <div
                        className="color-box"
                        style={{ backgroundColor: swatch.color }}
                      />
                    )}
                  </div>
                  <div className="swatch-info">
                    <h3>{swatch.label}</h3>
                    <p className="swatch-color">{swatch.color}</p>
                    <div className="swatch-categories">
                      {swatch.categories.map((cat) => (
                        <span key={cat} className="category-tag">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="swatch-actions">
                    <button
                      type="button"
                      className="btn btn--small"
                      onClick={() => handleEdit(swatch)}
                    >
                      Upravit
                    </button>
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(swatch.id)}
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

AdminPanel.propTypes = {
  onBack: PropTypes.func.isRequired,
  customSwatches: PropTypes.array.isRequired,
  onSwatchesChange: PropTypes.func.isRequired,
}

export default AdminPanel
