import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Target, TrendingUp, Award, Settings, Bell, Palette, Shield, Upload, Star, Dumbbell, Activity, ThumbsUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user: authUser, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(authUser);
    const [recentActivities, setRecentActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);

    useEffect(() => {
        setUser(authUser);
    }, [authUser]);

    useEffect(() => {
        const fetchActivities = async () => {
            setActivitiesLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'x-auth-token': token,
                    },
                };
                const res = await axios.get('/api/activities', config);
                setRecentActivities(res.data);
            } catch (err) {
                console.error(err);
            }
            setActivitiesLoading(false);
        };

        if (authUser) {
            fetchActivities();
        }
    }, [authUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            let config;
            let body;

            if (user.profilePictureFile) {
                // If profile picture file is selected, use FormData
                const formData = new FormData();
                formData.append('profilePicture', user.profilePictureFile);
                formData.append('name', user.name || '');
                formData.append('email', user.email || '');
                formData.append('phone', user.phone || '');
                formData.append('location', user.location || '');
                formData.append('dietPlan', user.dietPlan || '');

                config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-auth-token': token,
                    },
                };
                body = formData;
            } else {
                // Otherwise, send JSON
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token,
                    },
                };
                body = JSON.stringify({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    location: user.location || '',
                    dietPlan: user.dietPlan || '',
                    profilePicture: user.profilePicture || '',
                });
            }

            const res = await axios.put('/api/profile', body, config);
            login(res.data.user, token);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const fitnessGoals = [
        { icon: Target, text: 'Lose 10kg', progress: 75 },
        { icon: TrendingUp, text: 'Run 5km in 25 mins', progress: 50 },
        { icon: Dumbbell, text: 'Bench press 80kg', progress: 90 },
    ];

    const achievements = [
        { icon: Award, title: '50 Workouts', description: 'Completed 50 workouts' },
        { icon: Award, title: 'Mountain Climber', description: 'Cycled 1000km' },
        { icon: Award, title: 'Early Bird', description: 'Workout before 6 AM for 30 days' },
    ];

    const iconMap = {
        Activity,
        Dumbbell,
        ThumbsUp,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 font-sans text-white">
            <div className="min-h-screen bg-black/25 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {/* Profile Header */}
                    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8 border border-white/20 dark:border-gray-700/30">
                        <div className="relative group">
                            {user.profilePicture && user.profilePicture !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==' ? (
                                <img src={user.profilePicture} alt="User Avatar" className="w-32 h-32 rounded-full shadow-lg border-4 border-blue-400/50 object-cover" />
                            ) : (
                                <div className="blank-profile-placeholder">
                                    <User className="w-16 h-16 text-gray-500 dark:text-gray-400" />
                                </div>
                            )}
                            {isEditing && (
                                <>
                                <label htmlFor="profilePictureInput" className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Upload className="w-8 h-8 text-white" />
                                </label>
                                <input
                                    id="profilePictureInput"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            setUser(prev => ({ ...prev, profilePictureFile: file }));
                                            // Show preview
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                setUser(prev => ({ ...prev, profilePicture: ev.target.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                </>
                            )}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            {isEditing ? (
                                <>
                                <input type="text" name="name" value={user.name} onChange={handleInputChange} className="text-4xl font-bold text-white bg-transparent border-b-2 border-blue-500/50 focus:outline-none focus:border-blue-500 transition-colors" />
                                <textarea
                                    name="dietPlan"
                                    value={user.dietPlan || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter your diet plan"
                                    className="mt-4 w-full p-2 rounded-md text-black"
                                    rows={4}
                                />
                                </>
                            ) : (
                                <>
                                <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                                {user.dietPlan && (
                                    <p className="mt-4 whitespace-pre-wrap">{user.dietPlan}</p>
                                )}
                                </>
                            )}
                            <p className="text-gray-400 dark:text-gray-300 mt-2 text-lg flex items-center justify-center sm:justify-start">
                                <Star className="w-5 h-5 text-yellow-400 mr-2"/> Fitness Enthusiast
                            </p>
                        </div>
                        <div>
                            {isEditing ? (
                                <div className="flex space-x-3">
                                    <button onClick={handleSave} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center font-semibold shadow-md transition-transform transform hover:scale-105">
                                        <Save className="w-5 h-5 mr-2" /> Save
                                    </button>
                                    <button onClick={() => { setIsEditing(false); setUser(authUser); }} className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center font-semibold transition-colors">
                                        <X className="w-5 h-5 mr-2" /> Cancel
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center font-bold shadow-lg transition-transform transform hover:scale-105">
                                    <Edit className="w-5 h-5 mr-2" /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300 border border-white/20 dark:border-gray-700/30">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><User className="mr-3 text-blue-400" /> Personal Information</h2>
                                <div className="space-y-5">
                                    {[
                                        { icon: Mail, label: 'Email', name: 'email', value: user.email, type: 'email' },
                                        { icon: Phone, label: 'Phone', name: 'phone', value: user.phone || 'N/A', type: 'tel' },
                                        { icon: MapPin, label: 'Location', name: 'location', value: user.location || 'N/A', type: 'text' },
                                    ].map(item => (
                                        <div key={item.name} className="flex items-center group">
                                            <item.icon className="w-6 h-6 text-gray-400 dark:text-gray-300 mr-4 group-hover:text-blue-400 transition-colors" />
                                            {isEditing ? (
                                                <input type={item.type} name={item.name} value={item.value} onChange={handleInputChange} className="text-gray-200 dark:text-gray-300 bg-white/5 dark:bg-gray-700/30 rounded-md px-3 py-2 border-2 border-transparent focus:border-blue-500 focus:outline-none w-full transition-colors" />
                                            ) : (
                                                <span className="text-gray-300 dark:text-gray-400 text-lg">{item.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/10 dark:极gray-800/50 backdrop-blur-md rounded-3xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300 border border-white/20 dark:border-gray-700/30">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><Settings className="mr-3 text-blue-400" /> Settings</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center"><Bell className="w-5 h-5 mr-3"/> Notifications</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center"><Palette className="w-5 h-5 mr-3"/> Dark Mode</span>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center"><Shield className="w-5 h-5 mr-3"/> Privacy</span>
                                        <button className="text-blue-400 hover:underline">Manage</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-极 border border-white/20 dark:border-gray-700/30">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><Target className="mr-3 text-blue-400" /> Fitness Goals</h2>
                                <div className="space-y-6">
                                    {fitnessGoals.map(goal => (
                                        <div key={goal.text}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="flex items-center"><goal.icon className="w-5 h-5 mr-2 text-yellow-400"/> {goal.text}</span>
                                                <span>{goal.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 dark:bg-gray-600 rounded-full h-2.5">
                                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300 border border-white/20 dark:border-gray-700/30">
                                <h2 className="text-2xl font-bold text-white mb-6极flex items-center"><Award className="mr-3 text-blue-400" /> Achievements</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                                    {achievements.map(ach => (
                                        <div key={ach.title} className="bg-white/5 dark:bg-gray-700/30 p-4 rounded-xl hover:bg-white/10 dark:hover:bg-gray-700/40 transform hover:scale-105 transition-all duration-300">
                                            <ach.icon className="w-12 h-12 text-yellow-400 mx-auto mb-2"/>
                                            <h3 className="font-semibold">{ach.title}</h3>
                                            <p className="text-xs text-gray-400 dark:text-gray-300">{ach.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-3xl shadow-xl p-8 transform hover:-translate-y-1 transition-transform duration-300 border border-white/20 dark:border-gray-700/30">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><Activity className="mr-3 text-blue-400" /> Recent Activity</h2>
                                <ul className="space-y-4">
                                    {activitiesLoading ? (
                                        <p>Loading activities...</p>
                                    ) : recentActivities.length > 0 ? (
                                        recentActivities.map((act, index) => {
                                            const IconComponent = iconMap[act.icon] || Activity;
                                            return (
                                                <li key={index} className="flex items-start">
                                                    <div className="bg-blue-500/20 p-2 rounded-full mr-4">
                                                        <IconComponent className="w-6 h-6 text-blue-400"/>
                                                    </div>
                                                    <div>
                                                        <p>{act.text}</p>
                                                        <p className="text-sm text-gray-400 dark:text-gray-300">{act.time}</p>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    ) : (
                                        <p>No recent activity to display.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 24px;
                }
                .switch input { 
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #4a5568;
                    transition: .4s;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }
                input:checked + .slider {
                    background-color: #4299e1;
                }
                input:checked + .slider:before {
                    transform: translateX(16px);
                }
                .slider.round {
                    border-radius: 34px;
                }
                .slider.round:before {
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default Profile;
