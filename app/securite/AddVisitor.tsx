import { Calendar, Clock, FileText, Home, Phone, Save, User, X } from 'lucide-react-native';
import React, { useState } from 'react';

export default function AddVisitor() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    visitDate: '',
    visitTime: '',
    residentName: '',
    apartment: '',
    purpose: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.visitDate) newErrors.visitDate = 'La date de visite est requise';
    if (!formData.visitTime) newErrors.visitTime = 'L\'heure de visite est requise';
    if (!formData.residentName.trim()) newErrors.residentName = 'Le nom du résident est requis';
    if (!formData.apartment.trim()) newErrors.apartment = 'L\'appartement est requis';
    if (!formData.purpose.trim()) newErrors.purpose = 'Le motif de visite est requis';

    // Phone validation
    if (formData.phone && !/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    // Date validation (not in the past)
    if (formData.visitDate) {
      const visitDate = new Date(formData.visitDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (visitDate < today) {
        newErrors.visitDate = 'La date ne peut pas être dans le passé';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your API
      alert('Visiteur ajouté avec succès!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        visitDate: '',
        visitTime: '',
        residentName: '',
        apartment: '',
        purpose: '',
        notes: '',
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      visitDate: '',
      visitTime: '',
      residentName: '',
      apartment: '',
      purpose: '',
      notes: '',
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un visiteur</h1>
        <p className="text-gray-600">Enregistrer un nouveau visiteur pour la résidence</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visitor Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informations du visiteur</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Entrez le prénom"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Entrez le nom"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+33 6 12 34 56 78"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Informations de visite</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de visite *
              </label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.visitDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.visitDate && (
                <p className="mt-1 text-sm text-red-600">{errors.visitDate}</p>
              )}
            </div>

            {/* Visit Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Heure de visite *
              </label>
              <input
                type="time"
                name="visitTime"
                value={formData.visitTime}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.visitTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.visitTime && (
                <p className="mt-1 text-sm text-red-600">{errors.visitTime}</p>
              )}
            </div>

            {/* Purpose */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Motif de la visite *
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.purpose ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un motif</option>
                <option value="Visite familiale">Visite familiale</option>
                <option value="Ami">Ami</option>
                <option value="Livraison">Livraison</option>
                <option value="Travaux">Travaux</option>
                <option value="Service technique">Service technique</option>
                <option value="Professionnel de santé">Professionnel de santé</option>
                <option value="Autre">Autre</option>
              </select>
              {errors.purpose && (
                <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
              )}
            </div>
          </div>
        </div>

        {/* Resident Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Home className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">Résident concerné</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resident Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du résident *
              </label>
              <input
                type="text"
                name="residentName"
                value={formData.residentName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.residentName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nom du résident à visiter"
              />
              {errors.residentName && (
                <p className="mt-1 text-sm text-red-600">{errors.residentName}</p>
              )}
            </div>

            {/* Apartment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appartement *
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.apartment ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Apt 304, Bât A-205"
              />
              {errors.apartment && (
                <p className="mt-1 text-sm text-red-600">{errors.apartment}</p>
              )}
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes supplémentaires
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Informations supplémentaires sur la visite..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Annuler</span>
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le visiteur</span>
          </button>
        </div>
      </form>
    </div>
  );
}