import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { DocumentUploadSchema, DocumentUploadInput } from '@/lib/schemas';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  url: string;
}

export function useDocumentsVault() {
  const { profile } = useUser();
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Aadhaar Card (Cryptographically Masked)',
      type: 'Identity Proof',
      status: 'approved',
      date: '10 Apr 2024',
      url: '#'
    },
    {
      id: 'doc-2',
      name: '12th Standard Passing Marksheet (HSC)',
      type: 'Education Certificate',
      status: 'approved',
      date: '10 Apr 2024',
      url: '#'
    },
    {
      id: 'doc-3',
      name: 'ITI State Vocational Skill Certificate (NSQF Level 4)',
      type: 'Skill Credential',
      status: 'approved',
      date: '15 Jul 2024',
      url: '#'
    },
    {
      id: 'doc-4',
      name: 'Udyam MSME Registration Certificate (UDYAM-MH-26-0048291)',
      type: 'Enterprise Document',
      status: 'approved',
      date: '02 Aug 2024',
      url: '#'
    }
  ]);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const clearToast = useCallback(() => setToastMsg(null), []);

  const addDocument = useCallback(async (input: DocumentUploadInput): Promise<boolean> => {
    const validated = DocumentUploadSchema.safeParse(input);
    if (!validated.success) {
      setToastMsg(`Validation Error: ${validated.error.issues[0]?.message}`);
      return false;
    }

    setUploading(true);
    // Simulate optimistic update and verification entry
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: validated.data.document_name,
      type: validated.data.document_type,
      status: 'pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      url: validated.data.file_url
    };

    setDocuments(prev => [newDoc, ...prev]);
    setToastMsg(`Document "${validated.data.document_name}" uploaded and queued for state verification.`);
    setUploading(false);
    return true;
  }, []);

  const deleteDocument = useCallback((docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    setToastMsg('Document removed from vault.');
  }, []);

  return {
    documents,
    uploading,
    toastMsg,
    addDocument,
    deleteDocument,
    clearToast
  };
}
