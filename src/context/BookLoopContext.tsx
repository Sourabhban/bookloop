import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Book,
  ExchangeLocation,
  UserProfile,
  Badge,
  NeedBasedRequest,
  DepartmentStanding,
  Milestone,
} from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_LOCATIONS,
  INITIAL_USER,
  INITIAL_BADGES,
  INITIAL_NEED_REQUESTS,
  DEPARTMENT_LEADERBOARD,
} from '../data/mockData';

interface BookLoopContextType {
  books: Book[];
  locations: ExchangeLocation[];
  user: UserProfile;
  badges: Badge[];
  needRequests: NeedBasedRequest[];
  departments: DepartmentStanding[];
  activeTab: 'dashboard' | 'explore-map' | 'looppoints' | 'impact';
  setActiveTab: (tab: 'dashboard' | 'explore-map' | 'looppoints' | 'impact') => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  activeModal: 'scanner' | 'smart-match' | 'passport' | 'need-based' | 'book-details' | null;
  setActiveModal: (modal: 'scanner' | 'smart-match' | 'passport' | 'need-based' | 'book-details' | null) => void;
  // Live Demo Storyline State (0 = inactive, 1 = The Problem, 2 = The Discovery, 3 = The Transaction, 4 = The Handover & QR, 5 = The Impact)
  liveDemoStep: number;
  setLiveDemoStep: (step: number) => void;
  nextLiveDemoStep: () => void;
  resetLiveDemo: () => void;
  // Actions
  requestBook: (bookId: string, locationId: string) => boolean;
  verifyHandover: (bookId: string, recipientName: string, dept: string, locationId: string) => boolean;
  addScannedBook: (newBook: Partial<Book>) => Book;
  submitNeedRequest: (req: { courseName: string; bookTitle: string; urgency: 'urgent' | 'moderate'; semester: string; department: string }) => void;
  approveNeedRequest: (requestId: string, notes: string) => void;
  toggleWishlist: (bookTitle: string) => void;
}

const BookLoopContext = createContext<BookLoopContextType | undefined>(undefined);

export const BookLoopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('bookloop_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [locations] = useState<ExchangeLocation[]>(INITIAL_LOCATIONS);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bookloop_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('bookloop_badges');
    return saved ? JSON.parse(saved) : INITIAL_BADGES;
  });

  const [needRequests, setNeedRequests] = useState<NeedBasedRequest[]>(() => {
    const saved = localStorage.getItem('bookloop_need_requests');
    return saved ? JSON.parse(saved) : INITIAL_NEED_REQUESTS;
  });

  const [departments, setDepartments] = useState<DepartmentStanding[]>(DEPARTMENT_LEADERBOARD);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explore-map' | 'looppoints' | 'impact'>('dashboard');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeModal, setActiveModal] = useState<'scanner' | 'smart-match' | 'passport' | 'need-based' | 'book-details' | null>(null);
  const [liveDemoStep, setLiveDemoStep] = useState<number>(0);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('bookloop_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('bookloop_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bookloop_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('bookloop_need_requests', JSON.stringify(needRequests));
  }, [needRequests]);

  const requestBook = (bookId: string, locationId: string): boolean => {
    const targetLoc = locations.find((l) => l.id === locationId);
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          return {
            ...b,
            status: 'requested',
            exchangeLocationId: locationId,
            exchangeLocationName: targetLoc ? targetLoc.name : b.exchangeLocationName,
          };
        }
        return b;
      })
    );

    // If currently viewing this book, update selectedBook
    if (selectedBook && selectedBook.id === bookId) {
      setSelectedBook((prev) => (prev ? { ...prev, status: 'requested' } : null));
    }
    return true;
  };

  const verifyHandover = (
    bookId: string,
    recipientName: string,
    dept: string,
    locationId: string
  ): boolean => {
    const targetLoc = locations.find((l) => l.id === locationId);
    const locName = targetLoc ? targetLoc.name : 'Campus Approved Point';

    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'circulated',
      holderName: recipientName || 'Student Peer',
      department: dept || 'Computer Science',
      handoverPoint: locName,
      verified: true,
      notes: 'Dual QR handshake verified at official exchange location.',
    };

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          return {
            ...b,
            status: 'borrowed',
            totalLoops: b.totalLoops + 1,
            milestones: [newMilestone, ...b.milestones],
          };
        }
        return b;
      })
    );

    // Award LoopPoints to active user (+50 points for verified circulation)
    const pointsEarned = 50;
    const newTotalPoints = user.points + pointsEarned;
    const newLevel = Math.floor(newTotalPoints / 100) + 1;

    setUser((prev) => ({
      ...prev,
      points: newTotalPoints,
      level: newLevel,
      currentStreak: prev.currentStreak + 1,
      hoursRead: prev.hoursRead + 2,
    }));

    // Department points increment
    setDepartments((prev) =>
      prev.map((d) => (d.department.includes(dept) ? { ...d, booksShared: d.booksShared + 1 } : d))
    );

    // Check & unlock badges
    setBadges((prev) =>
      prev.map((bg) => {
        if (bg.id === 'b-4') {
          // Knowledge Sustainer (requires 5)
          const newProg = bg.progress + 1;
          return {
            ...bg,
            progress: newProg,
            unlocked: newProg >= bg.maxProgress,
            unlockedAt: newProg >= bg.maxProgress ? new Date().toISOString().split('T')[0] : bg.unlockedAt,
          };
        }
        if (bg.id === 'b-3') {
          // Circular Hero
          const newProg = bg.progress + 1;
          return {
            ...bg,
            progress: newProg,
            unlocked: newProg >= bg.maxProgress,
            unlockedAt: newProg >= bg.maxProgress ? new Date().toISOString().split('T')[0] : bg.unlockedAt,
          };
        }
        return bg;
      })
    );

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    // Refresh selectedBook if open
    setSelectedBook((prev) => {
      if (prev && prev.id === bookId) {
        return {
          ...prev,
          status: 'borrowed',
          totalLoops: prev.totalLoops + 1,
          milestones: [newMilestone, ...prev.milestones],
        };
      }
      return prev;
    });

    return true;
  };

  const addScannedBook = (newBookData: Partial<Book>): Book => {
    const randomCode = `BOOK-${Math.floor(1000 + Math.random() * 9000)}-${(newBookData.subject || 'ACAD').substring(0, 4).toUpperCase()}`;
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: newBookData.title || 'Untitled Academic Textbook',
      author: newBookData.author || 'Faculty / Author',
      edition: newBookData.edition || '1st Edition',
      subject: newBookData.subject || 'Engineering & Science',
      courseCode: newBookData.courseCode || 'CORE-101',
      coverImage: newBookData.coverImage || '/src/assets/images/book_data_science_1791878927941.jpg',
      status: 'available',
      ownerName: user.name,
      ownerDept: user.department,
      exchangeLocationId: newBookData.exchangeLocationId || 'loc-2',
      exchangeLocationName: newBookData.exchangeLocationName || 'Engineering Kiosk (Little Free Station)',
      condition: newBookData.condition || 'Good',
      totalLoops: 1,
      qrCode: randomCode,
      summary: newBookData.summary || 'Academic syllabus reference textbook cataloged with BookLoop AI Scanner.',
      keyTopics: newBookData.keyTopics && newBookData.keyTopics.length > 0 ? newBookData.keyTopics : ['Core Fundamentals', 'Syllabus Modules', 'Practical Labs'],
      syllabusMatch: 95,
      needBasedEligible: true,
      donorNotes: newBookData.donorNotes || 'Contributed for peer circular learning.',
      registeredDate: new Date().toISOString().split('T')[0],
      milestones: [
        {
          id: `m-init-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'donated',
          holderName: user.name,
          department: user.department,
          handoverPoint: newBookData.exchangeLocationName || 'Engineering Kiosk',
          verified: true,
          notes: 'Registered with BookLoop 2.0 AI Book Scanner.',
        },
      ],
    };

    setBooks((prev) => [newBook, ...prev]);

    // Update user stats
    setUser((prev) => ({
      ...prev,
      donatedBookIds: [newBook.id, ...prev.donatedBookIds],
      points: prev.points + 60, // points for donation verified
    }));

    return newBook;
  };

  const submitNeedRequest = (req: {
    courseName: string;
    bookTitle: string;
    urgency: 'urgent' | 'moderate';
    semester: string;
    department: string;
  }) => {
    const newReq: NeedBasedRequest = {
      id: `req-${Date.now()}`,
      studentAnonId: `STUDENT-AID-${Math.floor(100 + Math.random() * 900)}`,
      courseName: req.courseName,
      bookTitle: req.bookTitle,
      urgency: req.urgency,
      semester: req.semester,
      department: req.department,
      status: 'pending',
      dateRequested: new Date().toISOString().split('T')[0],
      assignedCoordinator: 'Dr. S. K. Raman (Librarian Coordinator)',
    };
    setNeedRequests((prev) => [newReq, ...prev]);
  };

  const approveNeedRequest = (requestId: string, notes: string) => {
    setNeedRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved', decisionNotes: notes } : r))
    );
  };

  const toggleWishlist = (bookTitle: string) => {
    setUser((prev) => {
      const exists = prev.wishlist.includes(bookTitle);
      return {
        ...prev,
        wishlist: exists ? prev.wishlist.filter((t) => t !== bookTitle) : [...prev.wishlist, bookTitle],
      };
    });
  };

  // Live Scenario Tour handlers
  const nextLiveDemoStep = () => {
    if (liveDemoStep === 0) {
      // Step 1: The Problem
      setLiveDemoStep(1);
      setActiveTab('dashboard');
    } else if (liveDemoStep === 1) {
      // Step 2: The Discovery (Smart Book Match)
      setLiveDemoStep(2);
      setActiveModal('smart-match');
    } else if (liveDemoStep === 2) {
      // Step 3: The Transaction (Open Book Details & Request)
      setLiveDemoStep(3);
      setActiveModal('book-details');
      setSelectedBook(books[0]);
    } else if (liveDemoStep === 3) {
      // Step 4: The Handover & QR Passport
      setLiveDemoStep(4);
      setActiveModal('passport');
      setSelectedBook(books[0]);
    } else if (liveDemoStep === 4) {
      // Step 5: The Impact (Knowledge Impact Dashboard)
      setLiveDemoStep(5);
      setActiveModal(null);
      setActiveTab('impact');
    } else {
      setLiveDemoStep(0);
    }
  };

  const resetLiveDemo = () => {
    setLiveDemoStep(0);
  };

  return (
    <BookLoopContext.Provider
      value={{
        books,
        locations,
        user,
        badges,
        needRequests,
        departments,
        activeTab,
        setActiveTab,
        selectedBook,
        setSelectedBook,
        activeModal,
        setActiveModal,
        liveDemoStep,
        setLiveDemoStep,
        nextLiveDemoStep,
        resetLiveDemo,
        requestBook,
        verifyHandover,
        addScannedBook,
        submitNeedRequest,
        approveNeedRequest,
        toggleWishlist,
      }}
    >
      {children}
    </BookLoopContext.Provider>
  );
};

export const useBookLoop = () => {
  const context = useContext(BookLoopContext);
  if (!context) {
    throw new Error('useBookLoop must be used within a BookLoopProvider');
  }
  return context;
};
