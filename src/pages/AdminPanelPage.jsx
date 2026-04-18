import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Building2,
  Stethoscope,
  Users,
  Settings as SettingsIcon,
  ChevronRight,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  Search,
  MoreVertical,
  Filter,
  CreditCard,
  Menu,
  X,
  PlusCircle,
  Database,
  Globe,
  ShieldCheck,
  ChevronDown,
  Phone,
  Calendar,
  History,
  Pencil,
  RefreshCw,
  CloudUpload,
  MapPin,
  Navigation,
  Tag,
  AlertCircle,
  Bell,
  Activity,
  Mail,
  FileText
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

/* ══════════════════════════════════════════════════════════
   ADMIN COMPONENTS
══════════════════════════════════════════════════════════ */

const TabButton = ({ active, icon: Icon, label, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
      ${active 
        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'}`}
  >
    <Icon size={20} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-bold text-sm tracking-wide">{label}</span>
    {badge !== undefined && (
      <span className={`ml-auto px-2 py-0.5 rounded-md text-[10px] font-black uppercase
        ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {badge}
      </span>
    )}
  </button>
);

const SectionHeader = ({ title, desc, action }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
    {action && (
      <div className="flex items-center gap-3">
        {action}
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings-pending');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, appointments: 0, doctors: 0, branches: 0 });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('branch');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [bookingToConfirm, setBookingToConfirm] = useState(null); // { id, date }
  const fileInputRef = useRef(null);

  // Data States
  const [appointments, setAppointments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [fees, setFees] = useState({ domestic: 0, international: 0 });
  const [socialLinks, setSocialLinks] = useState({ 
    facebook: '', 
    twitter: '', 
    instagram: '', 
    linkedin: '' 
  });
  const [contactInfo, setContactInfo] = useState({
    address: '',
    phones: [],
    emails: []
  });

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [activeTab]);

  const cleanupOldBookings = async () => {
    try {
      const thirtyTwoDaysAgo = new Date();
      thirtyTwoDaysAgo.setDate(thirtyTwoDaysAgo.getDate() - 32);
      
      const { data, error } = await supabase
        .from('appointments')
        .delete()
        .lt('created_at', thirtyTwoDaysAgo.toISOString());
        
      if (error) throw error;
      console.log('Auto-cleanup: Purged appointments older than 32 days.');
    } catch (err) {
      console.error('Auto-cleanup failed:', err);
    }
  };

  const fetchStats = async () => {
    // Run cleanup once when stats are fetched (usually on mount)
    cleanupOldBookings();
    try {
      const { count: pendingCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('booking_status', 'Pending');
      const { count: confirmedCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('booking_status', 'Confirmed');
      const { count: rejectedCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('booking_status', 'Rejected');
      const { count: doctorCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true });
      const { count: branchCount } = await supabase.from('branches').select('*', { count: 'exact', head: true });
      
      setStats({
        pending: pendingCount || 0,
        confirmed: confirmedCount || 0,
        rejected: rejectedCount || 0,
        appointments: (pendingCount || 0) + (confirmedCount || 0) + (rejectedCount || 0),
        doctors: doctorCount || 0,
        branches: branchCount || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab.includes('bookings')) {
        const statusMap = { 'bookings-pending': 'Pending', 'bookings-confirmed': 'Confirmed', 'bookings-rejected': 'Rejected' };
        const { data } = await supabase.from('appointments').select('*, doctors:doctor_id(doctor_name), branches:branch_id(branch_name)').eq('booking_status', statusMap[activeTab]).order('created_at', { ascending: false });
        setAppointments(data || []);
      } else if (activeTab === 'branches') {
        const { data } = await supabase.from('branches').select('*').order('created_at', { ascending: false });
        setBranches(data || []);
      } else if (activeTab === 'specialists') {
        const { data } = await supabase.from('specialties').select('*').order('name');
        setSpecialties(data || []);
      } else if (activeTab === 'doctors') {
        const [docRes, brRes, specRes] = await Promise.all([
          supabase.from('doctors').select('*, branches(branch_name)').order('doctor_name'),
          supabase.from('branches').select('*').order('branch_name'),
          supabase.from('specialties').select('*').order('name')
        ]);
        setDoctors(docRes.data || []);
        setBranches(brRes.data || []);
        setSpecialties(specRes.data || []);
      } else if (activeTab === 'admins') {
        const { data } = await supabase.from('users').select('*').eq('role', 'admin').order('created_at', { ascending: false });
        setAdmins(data || []);
      } else if (activeTab === 'fees' || activeTab === 'settings') {
        const { data } = await supabase.from('settings').select('*');
        setFees({ 
          domestic: data?.find(s => s.key === 'advance_booking_fee_domestic')?.value || 0,
          domestic_gateway: data?.find(s => s.key === 'gateway_charges_domestic')?.value || 0,
          international: data?.find(s => s.key === 'advance_booking_fee_international')?.value || 0,
          international_gateway: data?.find(s => s.key === 'gateway_charges_international')?.value || 0
        });
        setSocialLinks({
          facebook: data?.find(s => s.key === 'social_facebook')?.value || '',
          twitter: data?.find(s => s.key === 'social_twitter')?.value || '',
          instagram: data?.find(s => s.key === 'social_instagram')?.value || '',
          linkedin: data?.find(s => s.key === 'social_linkedin')?.value || ''
        });

        const contactPhonesRaw = data?.find(s => s.key === 'contact_phones')?.value;
        const contactEmailsRaw = data?.find(s => s.key === 'contact_emails')?.value;
        
        setContactInfo({
          address: data?.find(s => s.key === 'contact_address')?.value || '',
          phones: contactPhonesRaw ? JSON.parse(contactPhonesRaw) : [],
          emails: contactEmailsRaw ? JSON.parse(contactEmailsRaw) : []
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (id, newStatus, updatedDate = null) => {
    // If confirming, and we haven't asked for date yet, show modal
    if (newStatus === 'Confirmed' && !updatedDate) {
      const apt = appointments.find(a => a.id === id);
      setBookingToConfirm({ id, date: apt.preferred_date });
      return;
    }

    // Optimistic Update
    const prevApts = [...appointments];
    setAppointments(appointments.map(a => a.id === id ? { ...a, booking_status: newStatus, preferred_date: updatedDate || a.preferred_date } : a));
    
    try {
      const updatePayload = { booking_status: newStatus };
      if (updatedDate) updatePayload.preferred_date = updatedDate;

      const { error } = await supabase.from('appointments').update(updatePayload).eq('id', id);
      if (error) throw error;
      setBookingToConfirm(null);
      fetchStats();
      fetchData();
    } catch (err) {
      setAppointments(prevApts);
      alert('Error updating booking: ' + err.message);
    }
  };

  const toggleActiveness = async (table, id, currentStatus) => {
    // Optimistic Update
    const setterMap = { 'branches': setBranches, 'specialties': setSpecialties, 'doctors': setDoctors };
    const dataMap = { 'branches': branches, 'specialties': specialties, 'doctors': doctors };
    
    const prevData = [...dataMap[table]];
    setterMap[table](dataMap[table].map(item => item.id === id ? { ...item, is_active: !currentStatus } : item));

    try {
      const { error } = await supabase.from(table).update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      setterMap[table](prevData);
      alert('Error toggling status: ' + err.message);
    }
  };

  const deleteItem = async (table, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
      fetchStats();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const demoteAdmin = async (id, email) => {
    if (!confirm(`Are you sure you want to demote ${email} to a regular user?`)) return;
    try {
      const { error } = await supabase.from('users').update({ role: 'user' }).eq('id', id);
      if (error) throw error;
      fetchData();
      fetchStats();
    } catch (err) {
      alert('Error demoting admin: ' + err.message);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const { error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
      if (error) throw error;
      return true;
    } catch (err) {
      alert('Error updating setting: ' + err.message);
      return false;
    }
  };

  const updateFee = async (key, value) => {
    if (await updateSetting(key, value)) {
      alert('Fee updated successfully!');
      fetchData();
    }
  };

  const handleManagementSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSubmit = { ...formData };
      if (editingItem) dataToSubmit.id = editingItem.id;

      if ((modalType === 'branch' || modalType === 'specialty' || modalType === 'doctor') && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('branch-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage.from('branch-images').getPublicUrl(fileName);
        dataToSubmit.image_url = publicUrlData.publicUrl;
      }

      // Prepare payload: strip frontend-only or non-existent columns to avoid DB errors
      let finalPayload = { ...dataToSubmit };
      if (modalType === 'doctor') {
        const { branch_ids, branches, ...rest } = finalPayload;
        // To support multiple branches in the directory list, you'll need to add 
        // the 'branch_ids' column to your 'doctors' table (type: jsonb or uuid[]).
        finalPayload = rest;
      }

      const { error } = await supabase.from(
        modalType === 'branch' ? 'branches' : 
        modalType === 'specialty' ? 'specialties' : 'doctors'
      ).upsert(finalPayload);

      if (error) throw error;
      setShowModal(false);
      setEditingItem(null);
      setFormData({});
      setImageFile(null);
      fetchData();
      fetchStats();
    } catch (err) {
      alert('Error saving: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item);
    setImageFile(null);
    setShowModal(true);
  };

  /* ══════════════════════════════════════════════════════════
     MODAL COMPONENT
  ══════════════════════════════════════════════════════════ */
  const renderManagementModal = () => (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden relative z-10 border border-slate-100"
          >
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-start justify-between bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-1.5">
                  {editingItem ? 'Edit' : 'Add New'} {modalType === 'branch' ? 'Branch' : modalType === 'specialty' ? 'Specialty' : 'Doctor'}
                </h2>
                <p className="text-xs text-slate-400 font-bold">Please fill in all required information below.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 shrink-0"><X size={20} /></button>
            </div>

            <form onSubmit={handleManagementSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {modalType === 'branch' && (
                <>
                  <div className="space-y-2 mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Branch Banner Image</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100/80 hover:border-primary-300 hover:shadow-inner transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                    >
                       {(imageFile || formData.image_url) ? (
                         <>
                           <img 
                             src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                             alt="Preview" 
                             className="absolute inset-0 w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                           />
                           <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300" />
                           <div className="relative z-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                             <div className="bg-white text-primary-500 p-2.5 rounded-xl shadow-xl">
                                <RefreshCw size={18} />
                             </div>
                             <span className="text-[10px] font-black bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur shadow-sm text-white tracking-widest uppercase">Change Banner</span>
                           </div>
                         </>
                       ) : (
                         <div className="flex flex-col items-center text-slate-400 group-hover:text-primary-500 transition-colors gap-3 scale-95 group-hover:scale-100 duration-300">
                           <div className="bg-white p-3.5 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                             <CloudUpload size={28} />
                           </div>
                           <span className="text-xs font-bold tracking-wide">Click to browse files</span>
                         </div>
                       )}
                    </div>
                    
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      required={!editingItem && !formData.image_url}
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Branch Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Building2 size={16} />
                        </div>
                        <input 
                          type="text" required value={formData.branch_name || ''} 
                          onChange={(e) => setFormData({...formData, branch_name: e.target.value})}
                          placeholder="e.g. LifeCare Main Center" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Main Location</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <MapPin size={16} />
                          </div>
                          <input 
                            type="text" required value={formData.city || ''} 
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            placeholder="e.g. Kolkata, Mumbai" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sub Location</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <Navigation size={16} />
                          </div>
                          <input 
                            type="text" required value={formData.sub_location || ''} 
                            onChange={(e) => setFormData({...formData, sub_location: e.target.value})}
                            placeholder="e.g. 123 Hospital Road" 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sub Line</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Tag size={16} />
                        </div>
                        <input 
                          type="text" required value={formData.subline || ''} 
                          onChange={(e) => setFormData({...formData, subline: e.target.value})}
                          placeholder="e.g. Best hospital of the city" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-5 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'specialty' && (
                <>
                  <div className="space-y-2 mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specialty Image</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100/80 hover:border-primary-300 hover:shadow-inner transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                    >
                       {(imageFile || formData.image_url) ? (
                         <>
                           <img 
                             src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                             alt="Preview" 
                             className="absolute inset-0 w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                           />
                           <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300" />
                           <div className="relative z-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                             <div className="bg-white text-primary-500 p-2.5 rounded-xl shadow-xl">
                                <RefreshCw size={18} />
                             </div>
                             <span className="text-[10px] font-black bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur shadow-sm text-white tracking-widest uppercase">Change Image</span>
                           </div>
                         </>
                       ) : (
                         <div className="flex flex-col items-center text-slate-400 group-hover:text-primary-500 transition-colors gap-3 scale-95 group-hover:scale-100 duration-300">
                           <div className="bg-white p-3.5 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                             <CloudUpload size={28} />
                           </div>
                           <span className="text-xs font-bold tracking-wide">Click to browse files</span>
                         </div>
                       )}
                    </div>
                    
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      required={!editingItem && !formData.image_url}
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialists Name</label>
                    <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-100 transition" placeholder="e.g. Cardiology" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtitle</label>
                    <input required value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-100 transition" placeholder="e.g. Heart Care" />
                  </div>
                </>
              )}

              {modalType === 'doctor' && (
                <>
                  <div className="space-y-2 mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Doctor Profile Image</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-slate-100/80 hover:border-primary-300 hover:shadow-inner transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                    >
                       {(imageFile || formData.image_url) ? (
                         <>
                           <img 
                             src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url} 
                             alt="Preview" 
                             className="absolute inset-0 w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
                           />
                           <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-300" />
                           <div className="relative z-10 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                             <div className="bg-white text-primary-500 p-2.5 rounded-xl shadow-xl">
                                <RefreshCw size={18} />
                             </div>
                             <span className="text-[10px] font-black bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur shadow-sm text-white tracking-widest uppercase">Change Image</span>
                           </div>
                         </>
                       ) : (
                         <div className="flex flex-col items-center text-slate-400 group-hover:text-primary-500 transition-colors gap-3 scale-95 group-hover:scale-100 duration-300">
                           <div className="bg-white p-3.5 rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                             <CloudUpload size={28} />
                           </div>
                           <span className="text-xs font-bold tracking-wide">Click to browse files</span>
                         </div>
                       )}
                    </div>
                    
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      required={!editingItem && !formData.image_url}
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input required value={formData.doctor_name || ''} onChange={e => setFormData({...formData, doctor_name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-100 transition" placeholder="Dr. John Doe" />
                  </div>

                  <div className="space-y-6 pt-2">
                    {/* Specialization Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={14} className="text-primary-500" />
                          <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.15em]">Specializations</label>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                          {(formData.specialization || '').split(',').filter(Boolean).length} Selected
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-[24px] max-h-[160px] overflow-y-auto custom-scrollbar flex flex-wrap gap-2">
                        {specialties.map(s => {
                          const currentSpecs = (formData.specialization || '').split(',').map(x => x.trim()).filter(Boolean);
                          const isSelected = currentSpecs.includes(s.name);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                let newSpecs = isSelected ? currentSpecs.filter(x => x !== s.name) : [...currentSpecs, s.name];
                                setFormData({ ...formData, specialization: newSpecs.join(', ') });
                              }}
                              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 flex items-center gap-2 border shadow-sm
                                ${isSelected 
                                  ? 'bg-primary-500 border-primary-400 text-white shadow-primary-500/20 scale-[1.03]' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-primary-300 hover:bg-primary-50/30'}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-200'}`} />
                              {s.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Branch Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-secondary-500" />
                          <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.15em]">Assigned Branches</label>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                          {Array.isArray(formData.branch_ids) ? formData.branch_ids.length : (formData.branch_id ? 1 : 0)} Selected
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-[24px] max-h-[160px] overflow-y-auto custom-scrollbar flex flex-wrap gap-2">
                        {branches.map(b => {
                          const currentBranches = Array.isArray(formData.branch_ids) ? formData.branch_ids : (formData.branch_id ? [formData.branch_id] : []);
                          const isSelected = currentBranches.includes(b.id);
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                let newBranches = isSelected ? currentBranches.filter(id => id !== b.id) : [...currentBranches, b.id];
                                setFormData({ ...formData, branch_ids: newBranches, branch_id: newBranches[0] || null });
                              }}
                              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 flex items-center gap-2 border shadow-sm
                                ${isSelected 
                                  ? 'bg-slate-800 border-slate-700 text-white shadow-slate-400/20 scale-[1.03]' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50/50'}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                              {b.branch_name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>


                </>
              )}

              <div className="flex gap-3 pt-6 border-t border-slate-50">
                <button 
                  type="button" 
                  onClick={() => {setShowModal(false); setEditingItem(null); setFormData({}); setImageFile(null);}}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-sm font-black hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-primary-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{editingItem ? 'Save Changes' : 'Create Now'}</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {renderManagementModal()}
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[99]"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-grow pt-4 md:pt-10 px-4 md:px-6 max-w-[1600px] mx-auto w-full gap-6">
        
        {/* Sidebar Nav */}
        <aside className={`
          fixed md:relative left-0 top-0 h-screen md:h-auto z-[100] md:z-10 
          w-[280px] md:w-64 flex flex-col pt-0 md:pt-4 pb-0 md:pb-10 transition-all duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="bg-white md:bg-white/70 backdrop-blur-2xl md:border border-slate-200/50 rounded-r-[40px] md:rounded-[40px] p-6 h-full shadow-2xl shadow-slate-900/10 md:shadow-none overflow-y-auto custom-scrollbar flex flex-col">
            <div className="mb-10 mt-6 md:mt-2 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Control</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Admin</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1 flex-1">
              <div className="px-4 py-3">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Patient Queue</p>
              </div>
              
              <TabButton active={activeTab === 'bookings-pending'} icon={ClipboardList} label="Pending" onClick={() => {setActiveTab('bookings-pending'); setIsSidebarOpen(false);}} badge={stats.pending} />
              <TabButton active={activeTab === 'bookings-confirmed'} icon={CheckCircle} label="Confirmed" onClick={() => {setActiveTab('bookings-confirmed'); setIsSidebarOpen(false);}} />
              <TabButton active={activeTab === 'bookings-rejected'} icon={XCircle} label="Rejected" onClick={() => {setActiveTab('bookings-rejected'); setIsSidebarOpen(false);}} />

              <div className="my-6 h-px bg-slate-50/50" />
              <div className="px-4 py-3">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Clinical Resources</p>
              </div>

              <TabButton active={activeTab === 'branches'} icon={Building2} label="Branches" onClick={() => {setActiveTab('branches'); setIsSidebarOpen(false);}} />
              <TabButton active={activeTab === 'specialists'} icon={Stethoscope} label="Specialists" onClick={() => {setActiveTab('specialists'); setIsSidebarOpen(false);}} />
              <TabButton active={activeTab === 'doctors'} icon={Users} label="Doctors" onClick={() => {setActiveTab('doctors'); setIsSidebarOpen(false);}} />

              <div className="my-6 h-px bg-slate-50/50" />
              <div className="px-4 py-3">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Settings</p>
              </div>

              <TabButton active={activeTab === 'fees'} icon={CreditCard} label="Advance Fees" onClick={() => {setActiveTab('fees'); setIsSidebarOpen(false);}} />
              <TabButton active={activeTab === 'admins'} icon={ShieldCheck} label="System Admins" onClick={() => {setActiveTab('admins'); setIsSidebarOpen(false);}} />
              <TabButton active={activeTab === 'settings'} icon={SettingsIcon} label="Platform" onClick={() => {setActiveTab('settings'); setIsSidebarOpen(false);}} />
            </nav>

            <button 
              onClick={() => navigate('/appointment')}
              className="mt-10 group flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-slate-800 transition-colors">
                  <ArrowLeft size={14} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider">Exit Panel</span>
              </div>
              <ChevronRight size={14} className="opacity-30 group-hover:opacity-100" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pb-20 overflow-x-hidden">
          
          {/* Top Bar for Mobile - Ultra Modern Glassmorphism */}
          <div className="md:hidden sticky top-4 z-50 mb-8">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-xl shadow-slate-900/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/20 active:scale-90 transition-transform"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-[15px] font-black text-slate-900 leading-none mb-1">
                    {activeTab.split('-')[1]?.toUpperCase() || activeTab.toUpperCase()}
                  </h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Medical Console</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl">
                  <Bell size={18} />
                 </button>
                 <div className="w-10 h-10 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 font-black text-xs">
                   A
                 </div>
              </div>
            </div>
          </div>

          {/* Mobile Metrics Overview - Horizontal Scrolling for space efficiency */}
          <div className="md:hidden mb-10 overflow-x-auto no-scrollbar pb-4 flex gap-4 -mx-4 px-4">
            <div className="flex-shrink-0 w-[200px] p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-900/10">
               <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-primary-400">
                 <ClipboardList size={20} />
               </div>
               <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Queue Size</p>
               <h3 className="text-3xl font-black">{stats.pending} <span className="text-xs font-bold text-white/30 uppercase tracking-tight ml-1">Pending</span></h3>
            </div>
            
            <div className="flex-shrink-0 w-[200px] p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm">
               <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 text-emerald-500">
                 <CheckCircle size={20} />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Finalized</p>
               <h3 className="text-3xl font-black text-slate-900">{stats.confirmed} <span className="text-xs font-bold text-slate-300 uppercase tracking-tight ml-1">Today</span></h3>
            </div>

            <div className="flex-shrink-0 w-[200px] p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm">
               <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 text-rose-500">
                 <XCircle size={20} />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Canceled</p>
               <h3 className="text-3xl font-black text-slate-900">{stats.rejected} <span className="text-xs font-bold text-slate-300 uppercase tracking-tight ml-1">Total</span></h3>
            </div>

            <div className="flex-shrink-0 w-[200px] p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm">
               <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center mb-4 text-primary-500">
                 <Users size={20} />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Doctors</p>
               <h3 className="text-3xl font-black text-slate-900">{doctors.filter(d => d.is_active).length} <span className="text-xs font-bold text-slate-300 uppercase tracking-tight ml-1">Online</span></h3>
            </div>
          </div>

          {/* Desktop Metrics Overview - Elegant Grid for Professional Management */}
          <div className="hidden md:grid grid-cols-4 gap-6 mb-12">
            <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-colors" />
               <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-primary-400">
                 <ClipboardList size={22} />
               </div>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Pending Queue</p>
               <h3 className="text-4xl font-black">{stats.pending} <span className="text-xs font-bold text-white/30 uppercase tracking-tight ml-1">Waitlist</span></h3>
            </div>
            
            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
               <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                 <CheckCircle size={22} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Finalized Bookings</p>
               <h3 className="text-4xl font-black text-slate-900">{stats.confirmed} <span className="text-xs font-bold text-slate-300 uppercase tracking-tight ml-1">Today</span></h3>
            </div>

            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
               <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                 <XCircle size={22} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Rejected Entries</p>
               <h3 className="text-4xl font-black text-slate-900">{stats.rejected} <span className="text-xs font-bold text-slate-300 uppercase tracking-tight ml-1">Total</span></h3>
            </div>

            <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
               <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-6 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                 <Users size={22} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Active Doctors</p>
               <h3 className="text-4xl font-black text-slate-900">{doctors.filter(d => d.is_active).length} <span className="text-xs font-bold text-slate-300 uppercase tracking-tight ml-1">Online</span></h3>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Bookings Sections ── */}
            {activeTab.startsWith('bookings') && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader 
                  title={`${activeTab.split('-')[1].toUpperCase()} Bookings`} 
                  desc="Manage patient appointment requests and clinical scheduling." 
                />

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input placeholder="Search by patient name or ID..." className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition" />
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary-600 transition-colors"><Filter size={18} /></button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full hidden md:table">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Appointment Date</th>
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                          <th className="text-right px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {loading ? (
                          <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold">Loading results...</td></tr>
                        ) : appointments.length === 0 ? (
                          <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold">No bookings found in this category.</td></tr>
                        ) : appointments.map((apt) => (
                          <React.Fragment key={apt.id}>
                            <tr className={`transition-all duration-300 ${expandedRowId === apt.id ? 'bg-primary-50/30' : 'hover:bg-slate-50/80'}`}>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedRowId === apt.id ? 'bg-primary-500 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                    <span className="text-[10px] font-black">{apt.full_name?.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-slate-900 text-sm">{apt.full_name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">ID: {apt.booking_id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="px-3 py-1 bg-white border border-slate-100 text-slate-600 rounded-lg text-[10px] font-bold shadow-sm">{apt.department}</span>
                              </td>
                              <td className="px-8 py-5 text-sm font-bold text-slate-700">
                                {apt.preferred_date?.split('-').reverse().join('/')}
                              </td>
                              <td className="px-8 py-5">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider
                                  ${apt.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                  {apt.payment_status}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  {apt.booking_status === 'Pending' ? (
                                    <>
                                      <button onClick={() => handleBookingAction(apt.id, 'Confirmed')} className="w-8 h-8 flex items-center justify-center bg-white text-emerald-500 border border-emerald-100 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><CheckCircle size={14} /></button>
                                      <button onClick={() => handleBookingAction(apt.id, 'Rejected')} className="w-8 h-8 flex items-center justify-center bg-white text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><XCircle size={14} /></button>
                                    </>
                                  ) : apt.booking_status === 'Confirmed' && (
                                    <button onClick={() => handleBookingAction(apt.id, 'Rejected')} className="px-3 py-1 bg-white text-rose-500 border border-rose-100 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm text-[9px] font-black uppercase tracking-widest">
                                      Cancel Booking
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setExpandedRowId(expandedRowId === apt.id ? null : apt.id)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all border
                                      ${expandedRowId === apt.id ? 'bg-slate-900 text-white border-slate-900 rotate-180 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-primary-300 hover:text-primary-500'}`}
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            
                            {/* Expanded Details Row */}
                            <AnimatePresence>
                              {expandedRowId === apt.id && (
                                <tr>
                                  <td colSpan="5" className="p-0 border-none">
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }} 
                                      animate={{ height: 'auto', opacity: 1 }} 
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden bg-slate-50/50"
                                    >
                                      <div className="px-20 py-10 grid grid-cols-5 gap-8">
                                        <div className="col-span-1">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Details</p>
                                          <div className="space-y-3">
                                            <div className="flex flex-col">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Email Address</span>
                                              <span className="text-xs font-bold text-slate-700 break-all">{apt.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Phone Number</span>
                                              <span className="text-xs font-bold text-slate-700">{apt.phone}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="col-span-1">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Medical Assignment</p>
                                          <div className="space-y-3">
                                            <div className="flex flex-col">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Selected Branch</span>
                                              <span className="text-xs font-bold text-slate-700">{apt.branches?.branch_name || 'Main Center'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Selected Specialist</span>
                                              <span className="text-xs font-bold text-slate-700">{apt.doctors?.doctor_name || 'Generic Specialist'}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-span-1">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Timeline</p>
                                          <div className="space-y-3">
                                            <div className="flex flex-col">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Booking Date</span>
                                              <span className="text-xs font-bold text-slate-700">
                                                {new Date(apt.created_at).toLocaleDateString('en-GB')}
                                              </span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Appointment Date</span>
                                              <span className="text-xs font-bold text-primary-600">
                                                {apt.preferred_date?.split('-').reverse().join('/')}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-span-2 flex flex-col">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Payment & Concern</p>
                                          <div className="flex-1 bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm">
                                             <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                                                <div className="flex items-center gap-4">
                                                   <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-inner">
                                                     <CreditCard size={20} />
                                                   </div>
                                                   <div>
                                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Advance Paid</p>
                                                     <h4 className="text-lg font-black text-slate-900 leading-tight">₹{apt.advance_paid || '0.00'}</h4>
                                                   </div>
                                                </div>
                                                <div className="text-right">
                                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Status</p>
                                                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                                     ${apt.booking_status === 'Pending' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 
                                                       apt.booking_status === 'Confirmed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                                                       'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
                                                     {apt.booking_status}
                                                   </span>
                                                </div>
                                             </div>
                                             
                                             <div>
                                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Medical Concern</p>
                                               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                                                 <p className="text-xs font-bold text-slate-600 italic">"{apt.medical_concern || 'No specific concern mentioned'}"</p>
                                               </div>
                                             </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Data Cards (Premium Redesign) */}
                  <div className="md:hidden space-y-4 px-4 pb-10">
                    {loading ? (
                      <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-[32px]" />)}
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                           <Search size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-400">No booking records found.</p>
                      </div>
                    ) : appointments.map(apt => (
                      <div 
                        key={apt.id} 
                        className={`relative overflow-hidden bg-white rounded-[32px] border transition-all duration-300 ${expandedRowId === apt.id ? 'border-primary-200 shadow-xl shadow-primary-500/5 translate-y-[-4px]' : 'border-slate-100 shadow-sm'}`}
                      >
                        <div className="p-5">
                          <div 
                             className="flex justify-between items-start mb-4 cursor-pointer"
                             onClick={() => setExpandedRowId(expandedRowId === apt.id ? null : apt.id)}
                          >
                             <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-colors duration-300 ${expandedRowId === apt.id ? 'bg-primary-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                  {apt.full_name?.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="font-black text-slate-900 text-[15px] leading-tight mb-0.5">{apt.full_name}</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{apt.booking_id}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                    <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest">{apt.department}</span>
                                  </div>
                                </div>
                             </div>
                             <div 
                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-500 ${expandedRowId === apt.id ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}
                             >
                                <ChevronDown size={16} />
                              </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-slate-300" />
                              <span className="text-[11px] font-bold text-slate-600">
                                {apt.preferred_date?.split('-').reverse().join('/')}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                              ${apt.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                              {apt.payment_status}
                            </span>
                          </div>

                          <AnimatePresence>
                            {expandedRowId === apt.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pt-6 space-y-4"
                              >
                                <div className="space-y-4">
                                  {/* Section 1: Contact Details */}
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-slate-50/80 p-5 rounded-[24px] border border-slate-100 flex flex-col gap-4">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Information</p>
                                      <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-sm">
                                            <Mail size={18} />
                                          </div>
                                          <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Email Address</p>
                                            <p className="text-xs font-black text-slate-700 break-all">{apt.email || 'N/A'}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Phone size={18} />
                                          </div>
                                          <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Phone Number</p>
                                            <p className="text-xs font-black text-slate-700">{apt.phone}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section 2: Timeline & Booking Details */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50/80 p-4 rounded-[24px] border border-slate-100">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Booking Date</p>
                                      <div className="flex items-center gap-2">
                                        <History size={14} className="text-slate-400" />
                                        <span className="text-[11px] font-black text-slate-700">
                                          {new Date(apt.created_at).toLocaleDateString('en-GB')}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="bg-slate-50/80 p-4 rounded-[24px] border border-slate-100">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Appointment</p>
                                      <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-primary-500" />
                                        <span className="text-[11px] font-black text-primary-600">
                                          {apt.preferred_date?.split('-').reverse().join('/')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section 3: Assignment Details */}
                                  <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignment Details</p>
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                        <Building2 size={18} />
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Selected Branch</p>
                                        <p className="text-xs font-black text-slate-800">{apt.branches?.branch_name || 'Main Center'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                                        <Stethoscope size={18} />
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Selected Doctor</p>
                                        <p className="text-xs font-black text-slate-800">{apt.doctors?.doctor_name || 'Specialist Group'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section 4: Payment & Concern (Premium Dark Mode Style) */}
                                  <div className="bg-slate-900 p-5 rounded-[32px] text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/20 transition-colors" />
                                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-4 relative z-10 transition-colors group-hover:text-white/50">Payment & Concern</p>
                                     <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-white/10 relative z-10">
                                        <div>
                                          <p className="text-[9px] font-bold text-white/40 uppercase mb-1">Advance Paid</p>
                                          <div className="flex items-center gap-2">
                                            <CreditCard size={14} className="text-primary-400" />
                                            <span className="text-base font-black">₹{apt.advance_paid}</span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-[9px] font-bold text-white/40 uppercase mb-1">Status</p>
                                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${apt.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {apt.payment_status}
                                          </span>
                                        </div>
                                     </div>
                                     <div className="relative z-10">
                                        <p className="text-[9px] font-bold text-white/40 uppercase mb-2">Medical Concern</p>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                           <p className="text-xs font-bold text-slate-200 italic leading-relaxed">"{apt.medical_concern || 'No notes provided'}"</p>
                                        </div>
                                     </div>
                                  </div>

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Section 5: External Actions (Visible without expanding for Pending) */}
                          {apt.booking_status === 'Pending' && (
                            <div className="flex gap-3 mt-6 pt-5 border-t border-slate-50">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleBookingAction(apt.id, 'Confirmed');
                                }} 
                                className="flex-1 py-3.5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle size={14} strokeWidth={3} /> Approve
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleBookingAction(apt.id, 'Rejected');
                                }} 
                                className="flex-1 py-3.5 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                              >
                                <XCircle size={14} strokeWidth={3} /> Reject
                              </button>
                            </div>
                          )}

                          {apt.booking_status === 'Confirmed' && expandedRowId === apt.id && (
                            <div className="pt-6">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleBookingAction(apt.id, 'Rejected');
                                }} 
                                className="w-full py-4 bg-white text-rose-500 border-2 border-rose-50 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
                              >
                                Cancel Appointment
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Branches Management ── */}
            {activeTab === 'branches' && (
              <motion.div key="branches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader 
                  title="Hospital Branches" 
                  desc="Manage your facility network and operational locations." 
                  action={
                    <button 
                      onClick={() => {setEditingItem(null); setFormData({}); setModalType('branch'); setShowModal(true);}} 
                      className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all"
                    >
                      <Plus size={18} /> Add Branch
                    </button>
                  }
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[32px]" />)
                  ) : (
                    branches.map(branch => (
                      <div key={branch.id} className="group relative bg-white rounded-[32px] ring-1 ring-slate-200/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden flex flex-col">
                        <div className="h-56 relative overflow-hidden">
                          <img src={branch.image_url} alt={branch.branch_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 px-3.5 py-1.5 rounded-full text-[10px] font-black text-white shadow-lg flex items-center gap-1.5 uppercase tracking-widest">
                             <MapPin size={12} className="text-white" />
                             {branch.city}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                             <h3 className="font-black text-white text-2xl leading-tight mb-2 drop-shadow-md">{branch.branch_name}</h3>
                             <p className="text-slate-200 text-xs font-bold line-clamp-1 opacity-90">{branch.subline}</p>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          
                          <div className="flex items-start gap-4 mb-6 relative">
                            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-500 shrink-0 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors duration-500">
                               <Navigation size={16} />
                            </div>
                            <div className="pt-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Address</p>
                              <p className="text-xs font-bold text-slate-700 line-clamp-2 leading-relaxed">{branch.sub_location || 'Address not specified'}</p>
                            </div>
                          </div>
                          
                          <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                            <button 
                              onClick={() => toggleActiveness('branches', branch.id, branch.is_active)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300
                                ${branch.is_active ? 'bg-emerald-50 text-emerald-600 shadow-[0_0_0_1px_rgba(16,185,129,0.1)] hover:bg-emerald-100' : 'bg-slate-50 text-slate-500 shadow-[0_0_0_1px_rgba(226,232,240,1)] hover:bg-slate-100'}`}>
                              {branch.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                              {branch.is_active ? 'Active' : 'Inactive'}
                            </button>
                            
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => openEditModal('branch', branch)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-primary-500 hover:border-primary-500 hover:text-white hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
                              >
                                <Pencil size={14} />
                              </button>
                               <button 
                                 onClick={() => deleteItem('branches', branch.id)} 
                                 className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-rose-500 hover:border-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300"
                               >
                                 <Trash2 size={14} />
                               </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <button onClick={() => {setEditingItem(null); setFormData({}); setModalType('branch'); setShowModal(true);}} className="bg-slate-50/50 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:border-primary-400 hover:text-primary-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-500 gap-4 group">
                    <div className="w-16 h-16 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:bg-primary-50 group-hover:border-primary-100 group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                      <PlusCircle size={28} />
                    </div>
                    <div className="text-center">
                      <span className="block font-black text-slate-600 group-hover:text-primary-600 mb-1 transition-colors">Add New Location</span>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expand Your Network</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Specialists Section ── */}
            {activeTab === 'specialists' && (
              <motion.div key="specialists" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader 
                  title="Medical Specialties" 
                  desc="Configure medical departments and clinical categories." 
                  action={<button onClick={() => {setEditingItem(null); setFormData({}); setModalType('specialty'); setShowModal(true);}} className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all"><Plus size={18} /> New Specialty</button>}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[32px]" />)
                  ) : (
                    specialties.map(sp => {
                      let finalIconName = sp.icon_name;
                      let finalColor = sp.color;
                      
                      if (!finalIconName || !finalColor) {
                        const name = (sp.name || '').toLowerCase();
                        const mapping = [
                          { keywords: ['cardio', 'heart'], icon: 'Heart', color: '#ef4444' },
                          { keywords: ['neuro', 'brain', 'nerve'], icon: 'Brain', color: '#8b5cf6' },
                          { keywords: ['ortho', 'bone', 'joint'], icon: 'Bone', color: '#f97316' },
                          { keywords: ['derm', 'skin', 'beauty'], icon: 'Sparkles', color: '#ec4899' },
                          { keywords: ['pedia', 'child', 'baby'], icon: 'Baby', color: '#10b981' },
                          { keywords: ['eye', 'ophth', 'vision'], icon: 'Eye', color: '#06b6d4' },
                          { keywords: ['dent', 'teeth', 'smile', 'oral'], icon: 'Smile', color: '#3b82f6' },
                          { keywords: ['phar', 'medicine', 'drug'], icon: 'Pill', color: '#14b8a6' },
                          { keywords: ['surg', 'operat'], icon: 'Scissors', color: '#f43f5e' },
                          { keywords: ['urol', 'kidney', 'nephro', 'fluid'], icon: 'Droplets', color: '#3b82f6' },
                          { keywords: ['general', 'checkup', 'wellness'], icon: 'ShieldCheck', color: '#6366f1' },
                          { keywords: ['gast', 'stomach', 'digest'], icon: 'Activity', color: '#f59e0b' },
                          { keywords: ['patho', 'lab', 'blood', 'dna'], icon: 'Dna', color: '#ef4444' },
                          { keywords: ['emergency', 'trauma'], icon: 'Hospital', color: '#dc2626' },
                          { keywords: ['fever', 'infect'], icon: 'Thermometer', color: '#f97316' },
                          { keywords: ['wound', 'burn'], icon: 'Bandage', color: '#f59e0b' }
                        ];

                        const matched = mapping.find(m => m.keywords.some(k => name.includes(k)));
                        
                        if (matched) {
                          if (!finalIconName) finalIconName = matched.icon;
                          if (!finalColor) finalColor = matched.color;
                        } else {
                          const fallbacks = ['BriefcaseMedical', 'Stethoscope', 'Microscope', 'Syringe', 'Waves'];
                          const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1'];
                          let hash = 0;
                          for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
                          hash = Math.abs(hash);
                          if (!finalIconName) finalIconName = fallbacks[hash % fallbacks.length];
                          if (!finalColor) finalColor = colors[hash % colors.length];
                        }
                      }
                      
                      const IconComponent = Icons[finalIconName] || Icons.Activity;

                      return (
                        <div key={sp.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center group">
                          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 overflow-hidden"
                            style={!sp.image_url ? { backgroundColor: finalColor + '15', color: finalColor } : {}}>
                            {sp.image_url ? (
                              <img src={sp.image_url} alt={sp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <IconComponent size={28} strokeWidth={2} />
                            )}
                          </div>
                          <h3 className="font-extrabold text-slate-900 text-sm mb-1">{sp.name}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{sp.subtitle}</p>
                          
                          <div className="flex items-center gap-3 w-full pt-4 border-t border-slate-50">
                            <button 
                              onClick={() => toggleActiveness('specialties', sp.id, sp.is_active)}
                              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all
                                ${sp.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                              {sp.is_active ? 'Active' : 'Hidden'}
                            </button>
                            <button onClick={() => openEditModal('specialty', sp)} className="p-2 text-slate-300 hover:text-primary-500 transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => deleteItem('specialties', sp.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Doctors Section ── */}
            {activeTab === 'doctors' && (
              <motion.div key="doctors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader 
                  title="Clinical Staff" 
                  desc="Directory of all registered doctors and medical personnel." 
                  action={<button onClick={() => {setEditingItem(null); setFormData({}); setModalType('doctor'); setShowModal(true);}} className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all"><Plus size={18} /> Add Doctor</button>}
                />

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                  {/* Mobile Doctor Cards (Premium Redesign) */}
                  <div className="md:hidden space-y-6 px-4 pb-20">
                    {loading ? (
                      [1, 2].map(i => <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-[40px]" />)
                    ) : (
                      doctors.map(doc => (
                        <div key={doc.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
                          <div className="h-48 relative">
                             <img src={doc.image_url} alt={doc.doctor_name} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                             <div className="absolute bottom-4 left-6">
                                <h3 className="text-xl font-black text-white leading-tight">{doc.doctor_name}</h3>
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{doc.qualification}</p>
                             </div>
                             <div className="absolute top-4 right-4 animate-float">
                                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg ${doc.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                  {doc.is_active ? 'Active' : 'Offline'}
                                </div>
                             </div>
                          </div>
                          
                          <div className="p-6 space-y-4">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Specializations</p>
                              <div className="flex flex-wrap gap-2">
                                {(doc.specialization || '').split(',').map((s, i) => (
                                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">{s.trim()}</span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-2">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Assigned Venues</p>
                               <div className="space-y-2">
                                  {doc.branch_ids && Array.isArray(doc.branch_ids) && doc.branch_ids.length > 0 ? (
                                    doc.branch_ids.map(id => {
                                      const br = branches.find(b => b.id === id);
                                      return (
                                        <div key={id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                                          <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-primary-500 shadow-sm"><Building2 size={12} /></div>
                                          <span className="text-[11px] font-bold text-slate-700">{br?.branch_name || 'Medical Center'}</span>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50 italic opacity-50 text-slate-400">
                                       <AlertCircle size={14} />
                                       <span className="text-[11px] font-bold">No branches assigned</span>
                                    </div>
                                  )}
                               </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                               <button 
                                 onClick={() => openEditModal('doctor', doc)}
                                 className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                               >
                                 <Pencil size={14} /> Update Profile
                               </button>
                               <button 
                                 onClick={() => toggleActiveness('doctors', doc.id, doc.is_active)}
                                 className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${doc.is_active ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'} border border-current opacity-20 hover:opacity-100 active:scale-90`}
                               >
                                 {doc.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                               </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Specialization</th>
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Branch</th>
                          <th className="text-right px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {loading ? (
                          [1, 2, 3].map(i => <tr key={i}><td colSpan="5" className="px-8 py-5"><div className="h-10 bg-slate-50 animate-pulse rounded-xl" /></td></tr>)
                        ) : (
                          doctors.map(doc => (
                            <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-8 py-5 flex items-center gap-4">
                                <img src={doc.image_url} alt={doc.doctor_name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100" />
                                <div>
                                  <p className="font-extrabold text-slate-900 text-sm">{doc.doctor_name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{doc.qualification}</p>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="text-sm font-bold text-slate-700">
                                  {(() => {
                                    const specs = (doc.specialization || '').split(',').map(s => s.trim()).filter(Boolean);
                                    if (specs.length <= 2) return doc.specialization;
                                    return `${specs.slice(0, 2).join(', ')} +${specs.length - 2}`;
                                  })()}
                                </span>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex flex-col gap-1.5 text-slate-500">
                                  {doc.branch_ids && Array.isArray(doc.branch_ids) && doc.branch_ids.length > 0 ? (
                                    doc.branch_ids.map(id => {
                                      const br = branches.find(b => b.id === id);
                                      return (
                                        <div key={id} className="flex items-center gap-1.5">
                                          <Building2 size={12} className="text-slate-300" />
                                          <span className="text-[11px] font-bold text-slate-600 shrink-0">{br?.branch_name || 'Unknown'}</span>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <Building2 size={12} className="text-slate-300" />
                                      <span className="text-xs font-bold text-slate-400 italic">{doc.branches?.branch_name || 'Not Assigned'}</span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="px-8 py-5 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button onClick={() => openEditModal('doctor', doc)} className="p-2 text-slate-300 hover:text-primary-500 transition-colors"><Pencil size={16} /></button>
                                   <button 
                                    onClick={() => toggleActiveness('doctors', doc.id, doc.is_active)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm
                                      ${doc.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                    {doc.is_active ? 'Active' : 'Unavailable'}
                                  </button>
                                 </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Admin List Section ── */}
            {activeTab === 'admins' && (
              <motion.div key="admins" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader 
                  title="System Administrators" 
                  desc="List of users with full administrative access to the medical center." 
                />

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                    <table className="w-full hidden md:table">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Admin Details</th>
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">User ID</th>
                          <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                          <th className="text-right px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {loading ? (
                          [1, 2].map(i => <tr key={i}><td colSpan="4" className="px-8 py-5"><div className="h-10 bg-slate-50 animate-pulse rounded-xl" /></td></tr>)
                        ) : (
                          admins.map(adm => (
                            <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-8 py-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                                  <ShieldCheck size={20} />
                                </div>
                                <p className="font-extrabold text-slate-900 text-sm">{adm.email}</p>
                              </td>
                              <td className="px-8 py-5">
                                <span className="text-xs font-mono text-slate-400">{adm.id}</span>
                              </td>
                              <td className="px-8 py-5 text-sm font-bold text-slate-700">
                                {new Date(adm.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <button 
                                  onClick={() => demoteAdmin(adm.id, adm.email)}
                                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-slate-100 text-slate-400 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">
                                  Demote
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Mobile Admin Cards */}
                    <div className="md:hidden divide-y divide-slate-100">
                       {loading ? (
                        <div className="p-8 text-center text-slate-400 text-sm font-bold animate-pulse">Loading admins...</div>
                      ) : (
                        admins.map(adm => (
                          <div key={adm.id} className="p-5 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                                <ShieldCheck size={20} />
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm">{adm.email}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{adm.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined: {new Date(adm.created_at).toLocaleDateString()}</span>
                              <button onClick={() => demoteAdmin(adm.id, adm.email)} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">Demote</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Advance Fees Section ── */}
            {activeTab === 'fees' && (
              <motion.div key="fees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto pb-20">
                <SectionHeader 
                  title="Payment & Gateway Configuration" 
                  desc="Configure advance booking amounts and digital processing surcharges." 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Domestic Fees */}
                   <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 mb-6 shadow-sm border border-primary-100/50">
                          <CreditCard size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">Domestic (India)</h3>
                        <p className="text-[10px] text-slate-400 mb-8 font-black uppercase tracking-[0.2em]">Currency: INR (₹)</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Advance Amount</label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                              <input 
                                type="number" 
                                id="fee-domestic"
                                defaultValue={fees.domestic} 
                                className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-primary-100/30 focus:bg-white transition text-lg font-black text-slate-800"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Gateway / Service Charge</label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                              <input 
                                type="number" 
                                id="fee-domestic-gateway"
                                defaultValue={fees.domestic_gateway} 
                                className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-primary-100/30 focus:bg-white transition text-lg font-black text-slate-800"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                             <button 
                              onClick={async () => {
                                const adv = document.getElementById('fee-domestic').value;
                                const gtw = document.getElementById('fee-domestic-gateway').value;
                                await updateFee('advance_booking_fee_domestic', adv);
                                await updateFee('gateway_charges_domestic', gtw);
                              }}
                              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/20 active:scale-95"
                            >
                              Sync Domestic Rates
                            </button>
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* International Fees */}
                   <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-6 shadow-sm border border-purple-100/50">
                          <Globe size={28} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">International</h3>
                        <p className="text-[10px] text-slate-400 mb-8 font-black uppercase tracking-[0.2em]">Currency: USD ($)</p>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Advance Amount</label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                              <input 
                                type="number" 
                                id="fee-international"
                                defaultValue={fees.international} 
                                className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-primary-100/30 focus:bg-white transition text-lg font-black text-slate-800"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Gateway Surcharge</label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                              <input 
                                type="number" 
                                id="fee-international-gateway"
                                defaultValue={fees.international_gateway} 
                                className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-primary-100/30 focus:bg-white transition text-lg font-black text-slate-800"
                                placeholder="0.00"
                              />
                            </div>
                          </div>

                          <div className="pt-2">
                             <button 
                              onClick={async () => {
                                const adv = document.getElementById('fee-international').value;
                                const gtw = document.getElementById('fee-international-gateway').value;
                                await updateFee('advance_booking_fee_international', adv);
                                await updateFee('gateway_charges_international', gtw);
                              }}
                              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/20 active:scale-95"
                            >
                              Sync Global Rates
                            </button>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* ── Coming Soon Section ── */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <SectionHeader 
                  title="Platform Settings" 
                  desc="Manage your global site configuration and external integrations here." 
                />

                <div className="max-w-2xl mx-auto w-full">
                  {/* Social Media Links */}
                  <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm border border-primary-100/50">
                          <Globe size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-none mb-1.5">Social Presence</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connected with site footer</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {[
                          { key: 'social_facebook', label: 'Facebook URL', icon: Icons.Facebook, value: socialLinks.facebook },
                          { key: 'social_twitter', label: 'Twitter / X URL', icon: Icons.Twitter, value: socialLinks.twitter },
                          { key: 'social_instagram', label: 'Instagram URL', icon: Icons.Instagram, value: socialLinks.instagram },
                          { key: 'social_linkedin', label: 'LinkedIn URL', icon: Icons.Linkedin, value: socialLinks.linkedin }
                        ].map((social) => (
                          <div key={social.key}>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">{social.label}</label>
                            <div className="relative group">
                              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors">
                                <social.icon size={18} />
                              </div>
                              <input 
                                type="url" 
                                id={social.key}
                                defaultValue={social.value} 
                                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-primary-100/30 focus:bg-white transition text-sm font-bold text-slate-700"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        ))}

                        <div className="pt-4">
                           <button 
                            onClick={async () => {
                              const fb = document.getElementById('social_facebook').value;
                              const tw = document.getElementById('social_twitter').value;
                              const ig = document.getElementById('social_instagram').value;
                              const li = document.getElementById('social_linkedin').value;
                              
                              const results = await Promise.all([
                                updateSetting('social_facebook', fb),
                                updateSetting('social_twitter', tw),
                                updateSetting('social_instagram', ig),
                                updateSetting('social_linkedin', li)
                              ]);

                              if (results.every(r => r)) {
                                alert('Social links updated successfully!');
                                fetchData();
                              }
                            }}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-3"
                          >
                            <RefreshCw size={14} />
                            Sync Social Links
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Management */}
                  <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-900/5 relative overflow-hidden group mt-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-secondary-50 flex items-center justify-center text-secondary-500 shadow-sm border border-secondary-100/50">
                          <Phone size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-none mb-1.5">Contact Management</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Main office & reachable channels</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Office Address */}
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 px-1">Main Office Address</label>
                          <textarea 
                            value={contactInfo.address}
                            onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                            rows="3"
                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-secondary-100/30 focus:bg-white transition text-sm font-bold text-slate-700 resize-none"
                            placeholder="Full address of the medical center..."
                          />
                        </div>

                        {/* Multiple Phone Numbers */}
                        <div className="space-y-4">
                           <div className="flex items-center justify-between px-1">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Numbers</label>
                             <button 
                               onClick={() => setContactInfo({...contactInfo, phones: [...contactInfo.phones, '']})}
                               className="p-1 px-3 bg-secondary-50 text-secondary-600 rounded-lg text-[10px] font-black hover:bg-secondary-500 hover:text-white transition-all uppercase tracking-tighter flex items-center gap-1.5"
                             >
                                <Plus size={12} /> Add Number
                             </button>
                           </div>
                           
                           <div className="space-y-3">
                             {contactInfo.phones.map((phone, index) => (
                               <div key={index} className="flex gap-2">
                                 <div className="relative flex-1 group">
                                   <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary-500 transition-colors">
                                     <Phone size={16} />
                                   </div>
                                   <input 
                                     type="text" 
                                     value={phone}
                                     onChange={(e) => {
                                       const newPhones = [...contactInfo.phones];
                                       newPhones[index] = e.target.value;
                                       setContactInfo({...contactInfo, phones: newPhones});
                                     }}
                                     className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-secondary-100 focus:bg-white transition text-sm font-bold text-slate-700"
                                     placeholder="+91 XXXXX XXXXX"
                                   />
                                 </div>
                                 <button 
                                   onClick={() => {
                                     const newPhones = contactInfo.phones.filter((_, i) => i !== index);
                                     setContactInfo({...contactInfo, phones: newPhones});
                                   }}
                                   className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                             ))}
                             {contactInfo.phones.length === 0 && <p className="text-[11px] text-slate-400 italic text-center py-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No phone numbers added</p>}
                           </div>
                        </div>

                        {/* Multiple Emails */}
                        <div className="space-y-4">
                           <div className="flex items-center justify-between px-1">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Addresses</label>
                             <button 
                               onClick={() => setContactInfo({...contactInfo, emails: [...contactInfo.emails, '']})}
                               className="p-1 px-3 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-tighter flex items-center gap-1.5"
                             >
                                <Plus size={12} /> Add Email
                             </button>
                           </div>
                           
                           <div className="space-y-3">
                             {contactInfo.emails.map((email, index) => (
                               <div key={index} className="flex gap-2">
                                 <div className="relative flex-1 group">
                                   <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                                     <Mail size={16} />
                                   </div>
                                   <input 
                                     type="email" 
                                     value={email}
                                     onChange={(e) => {
                                       const newEmails = [...contactInfo.emails];
                                       newEmails[index] = e.target.value;
                                       setContactInfo({...contactInfo, emails: newEmails});
                                     }}
                                     className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white transition text-sm font-bold text-slate-700"
                                     placeholder="info@example.com"
                                   />
                                 </div>
                                 <button 
                                   onClick={() => {
                                     const newEmails = contactInfo.emails.filter((_, i) => i !== index);
                                     setContactInfo({...contactInfo, emails: newEmails});
                                   }}
                                   className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                 >
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                             ))}
                             {contactInfo.emails.length === 0 && <p className="text-[11px] text-slate-400 italic text-center py-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">No email addresses added</p>}
                           </div>
                        </div>

                        <div className="pt-4">
                           <button 
                            onClick={async () => {
                              const results = await Promise.all([
                                updateSetting('contact_address', contactInfo.address),
                                updateSetting('contact_phones', JSON.stringify(contactInfo.phones.filter(Boolean))),
                                updateSetting('contact_emails', JSON.stringify(contactInfo.emails.filter(Boolean)))
                              ]);

                              if (results.every(r => r)) {
                                alert('Contact information updated successfully!');
                                fetchData();
                              }
                            }}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-secondary-600 transition-all shadow-lg hover:shadow-secondary-500/20 active:scale-95 flex items-center justify-center gap-3"
                          >
                            <RefreshCw size={14} />
                            Apply Contact Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Date Confirmation Modal */}
          <AnimatePresence>
            {bookingToConfirm && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setBookingToConfirm(null)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
                >
                  <div className="p-10">
                    <div className="w-16 h-16 rounded-3xl bg-secondary-50 flex items-center justify-center text-secondary-500 mb-8 border border-secondary-100 shadow-sm">
                      <Calendar size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Confirm Appointment</h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                      Please verify or adjust the appointment date before finalizing this booking. The patient will be notified of this final scheduled date.
                    </p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Scheduled Date</label>
                        <div className="relative group">
                          <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                          <input 
                            type="date" 
                            value={bookingToConfirm.date}
                            onChange={(e) => setBookingToConfirm({ ...bookingToConfirm, date: e.target.value })}
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white transition font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => setBookingToConfirm(null)}
                          className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200/50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleBookingAction(bookingToConfirm.id, 'Confirmed', bookingToConfirm.date)}
                          className="flex-1 py-4 px-6 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                        >
                          Finalize Booking
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary-500 p-4 text-center">
                    <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Verification Requirement Active
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminPanelPage;
