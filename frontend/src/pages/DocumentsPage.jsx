import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import {
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlineStar,
  HiOutlineServer,
  HiOutlineArrowUpTray,
  HiOutlineMagnifyingGlass,
  HiOutlineListBullet,
  HiOutlineSquares2X2,
  HiOutlineChartBar,
  HiOutlineArrowDownTray,
  HiOutlineEllipsisVertical,
  HiOutlineTrash
} from 'react-icons/hi2';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

// Helper to calculate time ago
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function getTypeColors(type) {
  switch (type.toLowerCase()) {
    case 'pdf': return 'text-red-500 border-red-500/30 bg-red-500/10';
    case 'pptx': case 'ppt': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    case 'docx': case 'doc': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
    case 'txt': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
    default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
  }
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Documents');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.get('/documents').then((r) => r.data.data),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/documents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted successfully');
    },
  });

  const onDrop = useCallback(async (files) => {
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
      try {
        await api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success(`"${file.name}" uploaded successfully`);
      } catch (err) {
        toast.error(`Upload failed for ${file.name}`);
      }
    }
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    setUploading(false);
  }, [queryClient]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx', '.pptx'], 
      'text/plain': ['.txt'] 
    },
  });

  // Derived Stats
  const totalStorage = documents.reduce((acc, doc) => acc + (doc.size || 0), 0);
  const storageGB = (totalStorage / (1024 * 1024 * 1024)).toFixed(1);
  const storageMB = (totalStorage / (1024 * 1024)).toFixed(1);
  const displayStorage = storageGB > 0.1 ? `${storageGB} GB` : `${storageMB} MB`;
  
  const recentlyAdded = documents.filter(doc => {
    const diffTime = Math.abs(new Date() - new Date(doc.createdAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }).length;

  // Filtering
  const filters = ['All Documents', 'PDF', 'PPT', 'DOCX', 'TXT', 'Images'];
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All Documents' || doc.fileType.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, filteredDocs.length);

  return (
    <div className="min-h-screen p-8 max-w-[1600px] mx-auto text-[#E2E8F0]">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Your Documents</h1>
        <p className="text-[#94A3B8] text-sm">Manage and organize all your study materials in one place.</p>
      </div>

      {/* Stats & Upload Row */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          {/* Total Docs */}
          <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A253C] flex items-center justify-center">
              <HiOutlineDocumentText className="text-[#3B82F6] w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">{documents.length}</p>
              <p className="text-xs font-medium text-[#64748B] mt-1">Total Documents</p>
            </div>
          </div>
          {/* Storage */}
          <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#132A24] flex items-center justify-center">
              <HiOutlineServer className="text-[#10B981] w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">{displayStorage}</p>
              <p className="text-xs font-medium text-[#64748B] mt-1">Total Storage Used</p>
            </div>
          </div>
          {/* Folders */}
          <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D1B4E] flex items-center justify-center">
              <HiOutlineFolder className="text-[#8B5CF6] w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">3</p>
              <p className="text-xs font-medium text-[#64748B] mt-1">Folders</p>
            </div>
          </div>
          {/* Recently Added */}
          <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#322315] flex items-center justify-center">
              <HiOutlineStar className="text-[#F59E0B] w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">{recentlyAdded}</p>
              <p className="text-xs font-medium text-[#64748B] mt-1">Recently Added</p>
            </div>
          </div>
        </div>

        {/* Upload Box */}
        <div 
          {...getRootProps()}
          className={`
            xl:w-[450px] border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden
            ${isDragActive ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-[#2A303C] bg-[#111318] hover:border-[#3A404C]'}
          `}
        >
          <input {...getInputProps()} />
          <HiOutlineArrowUpTray className="w-6 h-6 text-[#3B82F6] mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Upload Documents</h3>
          <p className="text-xs text-[#64748B]">Drag & drop your files here or <span className="text-[#3B82F6] hover:underline">click to browse</span></p>
          <p className="text-[10px] text-[#475569] mt-3">Supports PDF, PPT, DOCX, TXT & more</p>
          
          {uploading && (
             <div className="absolute inset-0 bg-[#111318]/90 backdrop-blur-sm flex flex-col items-center justify-center">
               <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin mb-2" />
               <p className="text-xs font-bold text-[#3B82F6]">Uploading...</p>
             </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                ${activeFilter === filter 
                  ? 'bg-[#1A253C] border border-[#3B82F6]/30 text-[#3B82F6]' 
                  : 'bg-transparent border border-transparent text-[#94A3B8] hover:bg-[#1E222A] hover:text-white'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input 
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-[#0B0C10] border border-[#1E222A] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#64748B] outline-none focus:border-[#3B82F6]/50 w-full sm:w-64 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select className="bg-[#0B0C10] border border-[#1E222A] rounded-xl py-2 px-3 text-xs text-[#94A3B8] font-medium outline-none appearance-none cursor-pointer hover:border-[#3A404C] transition-colors">
              <option>Sort by: Recent</option>
              <option>Sort by: Name</option>
              <option>Sort by: Size</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#0B0C10] border border-[#1E222A] rounded-xl p-1">
            <button className="p-1.5 rounded-lg bg-[#1E222A] text-white transition-colors"><HiOutlineListBullet className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg text-[#64748B] hover:text-white transition-colors"><HiOutlineSquares2X2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#111318] border border-[#1E222A] rounded-2xl overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_1fr] gap-4 px-8 py-5 border-b border-[#1E222A] text-[10px] font-black text-[#64748B] uppercase tracking-[0.1em]">
          <div>Name</div>
          <div>Type</div>
          <div>Size</div>
          <div>Uploaded</div>
          <div className="text-right pr-4">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#1E222A]">
          {isLoading ? (
             <div className="py-24 flex justify-center">
                <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
             </div>
          ) : paginatedDocs.length === 0 ? (
             <div className="py-24 text-center text-[#64748B] text-sm font-medium">
                No documents found matching your criteria.
             </div>
          ) : (
            paginatedDocs.map(doc => {
              const typeStyle = getTypeColors(doc.fileType);
              // Extract colors for the custom document icon
              const iconTextColor = typeStyle.split(' ')[0]; // e.g. text-red-500
              const iconBorderColor = iconTextColor.replace('text-', 'border-'); 

              return (
                <div key={doc._id} className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_1fr] gap-4 px-8 py-5 items-center hover:bg-[#15181E] transition-colors group">
                  
                  {/* Name Column */}
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm relative">
                      <div className={`w-6 h-[26px] rounded-[3px] border-[2px] ${iconBorderColor} flex flex-col items-center justify-end pb-[2px] relative bg-white`}>
                         <div className={`absolute -top-[2px] -right-[2px] w-2.5 h-2.5 bg-white border-l-[2px] border-b-[2px] ${iconBorderColor} rounded-bl-[3px]`} />
                         <span className={`text-[5px] font-black uppercase ${iconTextColor}`}>{doc.fileType}</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate flex items-center gap-2">
                        {doc.title}
                        {doc.title.length % 2 === 0 && <HiOutlineStar className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />}
                      </h4>
                      <p className="text-[11px] text-[#64748B] truncate mt-1">Uploaded in General</p>
                    </div>
                  </div>

                  {/* Type Column */}
                  <div>
                    <span className={`px-2.5 py-1 rounded-[4px] text-[9px] font-black uppercase tracking-widest border ${typeStyle}`}>
                      {doc.fileType}
                    </span>
                  </div>

                  {/* Size Column */}
                  <div className="text-xs font-semibold text-[#94A3B8]">
                    {doc.readableSize}
                  </div>

                  {/* Uploaded Column */}
                  <div className="text-xs font-semibold text-[#94A3B8]">
                    <p className="text-[#E2E8F0] mb-0.5">{timeAgo(doc.createdAt)}</p>
                    <p className="text-[#64748B]">{formatDate(doc.createdAt)}</p>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center justify-end gap-2 pr-2">
                    <button 
                      onClick={() => window.location.href = `/workspace/${doc._id}`}
                      className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors"
                      title="Analytics / Workspace"
                    >
                      <HiOutlineChartBar className="w-[18px] h-[18px]" />
                    </button>
                    <button 
                      className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors"
                      title="Download"
                    >
                      <HiOutlineArrowDownTray className="w-[18px] h-[18px]" />
                    </button>
                    <div className="relative group/menu">
                      <button className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
                        <HiOutlineEllipsisVertical className="w-[18px] h-[18px]" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-36 bg-[#1E222A] border border-[#2A303C] rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 py-1.5">
                         <button 
                            onClick={() => deleteMut.mutate(doc._id)}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                         >
                            <HiOutlineTrash className="w-4 h-4" /> Delete
                         </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-5 border-t border-[#1E222A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#64748B]">
          <div>
            Showing {filteredDocs.length > 0 ? startIdx : 0} to {endIdx} of {filteredDocs.length} documents
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5">
               <button 
                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                 disabled={currentPage === 1}
                 className="p-1 hover:text-white disabled:opacity-30 transition-colors"
               >
                 &lt;
               </button>
               {Array.from({length: totalPages}, (_, i) => (
                 <button 
                   key={i}
                   onClick={() => setCurrentPage(i + 1)}
                   className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-[#1A253C] text-[#3B82F6] border border-[#3B82F6]/30 font-bold' : 'hover:bg-[#1E222A] hover:text-white'}`}
                 >
                   {i + 1}
                 </button>
               ))}
               <button 
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                 disabled={currentPage === totalPages || totalPages === 0}
                 className="p-1 hover:text-white disabled:opacity-30 transition-colors"
               >
                 &gt;
               </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span>Documents per page:</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-transparent text-white font-bold outline-none cursor-pointer"
              >
                <option value={5} className="bg-[#111318]">5</option>
                <option value={10} className="bg-[#111318]">10</option>
                <option value={20} className="bg-[#111318]">20</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
