import { BinPlacementRequest, PersonalDisposalRecord } from '../types';

const STORAGE_KEYS = {
  PERSONAL_RECORDS: 'ewaste_off_personal_records',
  BIN_REQUESTS: 'ewaste_off_bin_requests',
  USER_LOCATION: 'ewaste_off_user_location',
  REPORTED_RECYCLERS: 'ewaste_off_reported_recyclers'
};

export const StorageService = {
  getPersonalRecords(): PersonalDisposalRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERSONAL_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // hacky id generator but works 100% of the time
  addPersonalRecord(record: Omit<PersonalDisposalRecord, 'id'>): PersonalDisposalRecord {
    const records = this.getPersonalRecords();
    const newRecord: PersonalDisposalRecord = {
      ...record,
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    const updated = [newRecord, ...records];
    localStorage.setItem(STORAGE_KEYS.PERSONAL_RECORDS, JSON.stringify(updated));
    return newRecord;
  },

  getBinRequests(): BinPlacementRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BIN_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addBinRequest(request: Omit<BinPlacementRequest, 'id' | 'status' | 'requestDate'>): BinPlacementRequest {
    const requests = this.getBinRequests();
    const newRequest: BinPlacementRequest = {
      ...request,
      id: 'bin-req-' + Date.now(),
      status: 'Pending Review',
      requestDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newRequest, ...requests];
    localStorage.setItem(STORAGE_KEYS.BIN_REQUESTS, JSON.stringify(updated));
    return newRequest;
  },

  getSavedUserLocation(): { lat: number; lng: number; name: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_LOCATION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUserLocation(loc: { lat: number; lng: number; name: string }): void {
    localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(loc));
  },

  saveReportedRecycler(report: { recyclerId: string; recyclerName: string; reason: string; details: string; date: string }): void {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTED_RECYCLERS) || '[]');
      existing.push(report);
      localStorage.setItem(STORAGE_KEYS.REPORTED_RECYCLERS, JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }
  }
};
