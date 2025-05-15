import React from 'react';
    import {
      BookOpen,
      Users,
      Calendar,
      GraduationCap,
      Bell,
      Settings,
      LogOut,
      User,
      ListChecks,
      CalendarClock,
      LayoutList,
      UserRound,
      UserCircle,
    } from 'lucide-react';
    import { supabase } from '../lib/supabase';
    import { Profile } from '../types';

    interface DashboardProps {
      onLogout: () => void;
    }

    export default function Dashboard({ onLogout }: DashboardProps) {
      const [userRole, setUserRole] = React.useState<string | null>(null);
      const [userName, setUserName] = React.useState<string | null>(null);
      const [activeSection, setActiveSection] = React.useState<'home' | 'students' | 'teachers' | 'attendance' | 'grades' | 'notifications' | 'events' | 'settings'>('home');
      const [userEmail, setUserEmail] = React.useState('');
      const [userPhone, setUserPhone] = React.useState('');
      const [userAddress, setUserAddress] = React.useState('');
      const [currentDate, setCurrentDate] = React.useState(new Date());
      const [userFullName, setUserFullName] = React.useState<string | null>(null);
      const [userClass, setUserClass] = React.useState<string | null>(null);
      const [updateSuccess, setUpdateSuccess] = React.useState<boolean | null>(null);
      const [userFirstName, setUserFirstName] = React.useState('');
      const [userLastName, setUserLastName] = React.useState('');

      React.useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('role, first_name, last_name, class')
                .eq('id', user.id)
                .single();

              if (error) {
                console.error('Error fetching user profile:', error);
              } else if (profileData) {
                setUserRole((profileData as Profile).role);
                setUserName((profileData as Profile).first_name);
                setUserFullName(`${(profileData as Profile).first_name} ${(profileData as Profile).last_name}`);
                setUserClass((profileData as Profile).class || 'N/A');
                setUserEmail(user.email || 'N/A');
                setUserPhone(userPhone || 'N/A');
                setUserAddress(userAddress || 'N/A');
                setUserFirstName(profileData.first_name || '');
                setUserLastName(profileData.last_name || '');
              }
            }
          } catch (error) {
            console.error('Error during profile fetch:', error);
          }
        };

        fetchUserProfile();
      }, []);

      const handleLogout = React.useCallback(async () => {
        try {
          await supabase.auth.signOut();
          onLogout();
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }, [onLogout]);

      const handleLogoClick = () => {
        setActiveSection('home');
      };

      const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
      };

      const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserPhone(e.target.value);
      };

      const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserAddress(e.target.value);
      };

      const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFirstName(e.target.value);
      };

      const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserLastName(e.target.value);
      };

      const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserClass(e.target.value);
      };

      const handleSaveChanges = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error } = await supabase
              .from('profiles')
              .update({
                first_name: userFirstName,
                last_name: userLastName,
                class: userClass,
                email: userEmail,
                phone: userPhone,
                address: userAddress,
              })
              .eq('id', user.id);

            if (error) {
              console.error('Error updating profile:', error);
              setUpdateSuccess(false);
            } else {
              setUpdateSuccess(true);
              setUserName(userFirstName);
              setUserFullName(`${userFirstName} ${userLastName}`);
            }
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          setUpdateSuccess(false);
        }
      };

      const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      };

      const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      };

      const daysInMonth = getDaysInMonth(currentDate);
      const firstDayOfMonth = getFirstDayOfMonth(currentDate);

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const renderSection = () => {
        switch (activeSection) {
          case 'students':
            return (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Classmates</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'John Doe' },
                    { name: 'Jane Smith' },
                    { name: 'Peter Jones' },
                    { name: 'Alice Brown' },
                    { name: 'Bob Williams' },
                    { name: 'Sarah Davis' },
                  ].map((student, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
                      <UserRound className="w-24 h-24 mb-2 text-gray-700" />
                      <p className="text-gray-700 text-center">{student.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          case 'teachers':
            return (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Assigned Teacher</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <UserCircle className="w-20 h-20 mr-4 text-gray-700" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Dr. Emily Carter</h3>
                      <p className="text-gray-600">Mathematics Teacher</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Email: emily.carter@example.com
                    <br />
                    Office: Room 201
                  </p>
                </div>
              </div>
            );
          case 'attendance':
            return (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Attendance</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </h3>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {daysOfWeek.map((day, index) => (
                      <div key={index} className="p-2 text-center text-gray-700">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {Array.from({ length: daysInMonth + firstDayOfMonth }, (_, i) => {
                      if (i < firstDayOfMonth) {
                        return <div key={i} />;
                      }
                      const day = i - firstDayOfMonth + 1;
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                      const isSunday = date.getDay() === 0;
                      const isPresent = day % 3 !== 0 && !isSunday;
                      return (
                        <div
                          key={i}
                          className={`p-2 text-center rounded-md ${isPresent ? 'bg-green-100 text-green-700' : isSunday ? 'bg-gray-200 text-gray-500' : 'bg-red-100 text-red-700'}`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-gray-700">Classes Conducted: 30</p>
                  <p className="text-gray-700">Absences: 10</p>
                </div>
              </div>
            );
          case 'grades':
            return (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Grades</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="py-2 text-gray-900">Subject</th>
                        <th className="py-2 text-gray-900">Unit Test</th>
                        <th className="py-2 text-gray-900">Half Yearly</th>
                        <th className="py-2 text-gray-900">Finals</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-700">Mathematics</td>
                        <td className="py-2 text-gray-700">85</td>
                        <td className="py-2 text-gray-700">90</td>
                        <td className="py-2 text-gray-700">92</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-700">Science</td>
                        <td className="py-2 text-gray-700">78</td>
                        <td className="py-2 text-gray-700">82</td>
                        <td className="py-2 text-gray-700">88</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-700">English</td>
                        <td className="py-2 text-gray-700">92</td>
                        <td className="py-2 text-gray-700">94</td>
                        <td className="py-2 text-gray-700">95</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case 'notifications':
            return (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Notifications</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>New assignment posted for Mathematics</li>
                    <li>Upcoming test for Science on 2024-07-15</li>
                    <li>School holiday on 2024-07-20</li>
                  </ul>
                </div>
              </div>
            );
          case 'events':
            return (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Events</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>School trip to the museum on 2024-07-25</li>
                    <li>Mid-term exams starting on 2024-08-01</li>
                    <li>Project submission deadline on 2024-08-10</li>
                  </ul>
                </div>
              </div>
            );
          case 'settings':
            return (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Settings</h2>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={userFirstName}
                      onChange={handleFirstNameChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={userLastName}
                      onChange={handleLastNameChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                    <input
                      type="text"
                      value={userClass}
                      onChange={handleClassChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={handleEmailChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={handlePhoneChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={userAddress}
                      onChange={handleAddressChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button 
                    onClick={handleSaveChanges}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                  {updateSuccess === true && (
                    <p className="mt-2 text-green-500">Profile updated successfully!</p>
                  )}
                  {updateSuccess === false && (
                    <p className="mt-2 text-red-500">Failed to update profile.</p>
                  )}
                </div>
              </div>
            );
          default:
            return (
              <div className="mb-8 flex flex-col items-center">
                <UserRound className="w-32 h-32 mb-4 text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userFullName || 'User'}
                </h1>
                <p className="text-gray-600">
                  Class: {userClass}
                </p>
                <p className="text-gray-600">
                  Email: {userEmail}
                </p>
                <p className="text-gray-600">
                  Phone: {userPhone}
                </p>
              </div>
            );
        }
      };

      return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <button onClick={handleLogoClick} className="flex items-center justify-center h-16 border-b">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduFlow</span>
            </button>

            <nav className="mt-6">
              <div className="px-4 space-y-2">
                {[
                  { icon: Users, label: 'Students', section: 'students' },
                  { icon: User, label: 'Teachers', section: 'teachers' },
                  { icon: ListChecks, label: 'Attendance', section: 'attendance' },
                  { icon: GraduationCap, label: 'Grades', section: 'grades' },
                  { icon: Bell, label: 'Notifications', section: 'notifications' },
                  { icon: CalendarClock, label: 'Events', section: 'events' },
                  { icon: Settings, label: 'Settings', section: 'settings' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveSection(item.section)}
                    className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="ml-3">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            <div className="absolute bottom-0 w-full p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="ml-64 p-8">
            {renderSection()}
          </div>
        </div>
      );
    }
