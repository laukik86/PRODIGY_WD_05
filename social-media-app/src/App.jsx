import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Image, Video, Bookmark, User, Home, Bell, Search, Menu, X, Send, LogOut } from 'lucide-react';

// Sample data
const initialUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    username: "@alexj",
    avatar: "https://res.cloudinary.com/dhuonrrh9/image/upload/v1742707503/eren-yeager-pfp-with-cloudy-sky-p4ff16eninzqrgui_sz2rr4.jpg",
    bio: "Digital artist and photography enthusiast",
    followers: 245,
    following: 182
  },
  {
    id: 2,
    name: "Maya Patel",
    username: "@maya_creates",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZLeJiagbpgM7yfGciyY6yJ7bKyUpdoDBEUw&s",
    bio: "Travel blogger | Food lover | Adventure seeker",
    followers: 1024,
    following: 567
  },
  {
    id: 3,
    name: "Laukik",
    username: "@current_user",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYt2HYmxgDf4nKpUZy4-2-bhcvFa2xBUqylQ&s",
    bio: "This is your profile!",
    followers: 158,
    following: 203
  }
];

const initialPosts = [
  {
    id: 1,
    userId: 1,
    content: "Just finished my latest digital artwork! What do you think?",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBgJAekoveYXSbgOF-sR3Y7mU_Fdpql3M9CA&s",
    likes: 42,
    comments: [
      { id: 1, userId: 2, content: "This is amazing! Love the colors!", timestamp: "2h ago" },
      { id: 2, userId: 3, content: "Great work as always!", timestamp: "1h ago" }
    ],
    timestamp: "3h ago",
    tags: ["digitalart", "creativity"]
  },
  {
    id: 2,
    userId: 2,
    content: "Exploring the beautiful trails this weekend. The views were breathtaking!",
    image: "https://images.unsplash.com/photo-1745503262235-611b59926297?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likes: 78,
    comments: [
      { id: 3, userId: 1, content: "Wow! Where is this?", timestamp: "5h ago" }
    ],
    timestamp: "6h ago",
    tags: ["nature", "hiking", "weekend"]
  }
];

export default function SocialMediaApp() {
  // State management
  const [activeTab, setActiveTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(initialUsers[2]);
  const [users, setUsers] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'like', userId: 1, content: 'liked your post', timestamp: '1h ago' },
    { id: 2, type: 'comment', userId: 2, content: 'commented on your post', timestamp: '3h ago' },
    { id: 3, type: 'follow', userId: 1, content: 'started following you', timestamp: '1d ago' }
  ]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    // Search users
    const userResults = users.filter(
      user => user.name.toLowerCase().includes(query) || 
              user.username.toLowerCase().includes(query) ||
              user.bio.toLowerCase().includes(query)
    );
    
    // Search posts (content and tags)
    const postResults = posts.filter(
      post => post.content.toLowerCase().includes(query) ||
              post.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    setSearchResults({
      users: userResults,
      posts: postResults
    });
  }, [searchQuery, users, posts]);

  // Create new post
  const handleCreatePost = () => {
    if (newPostContent.trim() === '' && !uploadPreview) return;
    
    const tagsArray = newPostTags
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.substring(1));
    
    const newPost = {
      id: posts.length + 1,
      userId: currentUser.id,
      content: newPostContent,
      image: uploadPreview || null,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      tags: tagsArray
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostTags('');
    setUploadPreview(null);
  };

  // Handle liking a post
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // Check if already liked
        const alreadyLiked = post.likedByCurrentUser;
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedByCurrentUser: !alreadyLiked
        };
      }
      return post;
    }));
  };

  // Handle adding a comment
  const handleAddComment = (postId) => {
    if (newComment.trim() === '') return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: post.comments.length + 1,
          userId: currentUser.id,
          content: newComment,
          timestamp: 'Just now'
        };
        
        return {
          ...post,
          comments: [...post.comments, newCommentObj]
        };
      }
      return post;
    }));
    
    setNewComment('');
    setCommentingOnPost(null);
  };

  // Handle file upload
  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploadPreview("/api/placeholder/600/400");
      setIsUploading(false);
    }, 1500);
  };

  // Get user by ID
  const getUserById = (userId) => {
    return users.find(user => user.id === userId) || { name: "Unknown User", avatar: null };
  };

  // Handle follow/unfollow
  const handleFollow = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const isFollowing = user.isFollowedByCurrentUser;
        return {
          ...user,
          followers: isFollowing ? user.followers - 1 : user.followers + 1,
          isFollowedByCurrentUser: !isFollowing
        };
      }
      return user;
    }));
  };

  // Render Functions
  const renderHeader = () => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-blue-600">ConnectMe</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-1 ${activeTab === 'search' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Search size={20} />
              <span>Search</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center space-x-1 ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </nav>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <button 
              onClick={() => {
                setActiveTab('home');
                setShowMobileMenu(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-md ${activeTab === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('search');
                setShowMobileMenu(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-md ${activeTab === 'search' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <Search size={20} />
              <span>Search</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('notifications');
                setShowMobileMenu(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-md ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('profile');
                setShowMobileMenu(false);
              }}
              className={`flex items-center space-x-2 p-2 rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
            
            <button className="flex items-center space-x-2 p-2 text-red-600">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );

  const renderCreatePost = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-start space-x-3">
        <img
          src={currentUser.avatar}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            rows="3"
          />
          
          {uploadPreview && (
            <div className="relative mt-2">
              <img 
                src={uploadPreview} 
                alt="Upload preview" 
                className="rounded-lg w-full max-h-64 object-cover"
              />
              <button 
                onClick={() => setUploadPreview(null)}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="mt-2">
            <input
              value={newPostTags}
              onChange={e => setNewPostTags(e.target.value)}
              placeholder="Add tags (e.g. #photography #travel)"
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex space-x-3">
              <button 
                onClick={handleFileUpload}
                disabled={isUploading}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <Image size={20} />
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-600">
                <Video size={20} />
              </button>
            </div>
            
            <button
              onClick={handleCreatePost}
              disabled={newPostContent.trim() === '' && !uploadPreview}
              className={`px-4 py-2 rounded-full font-medium ${
                (newPostContent.trim() === '' && !uploadPreview)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPost = (post) => {
    const author = getUserById(post.userId);
    
    return (
      <div key={post.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        {/* Post Header */}
        <div className="p-4 flex items-center space-x-3">
          <img
            src={author.avatar || "/api/placeholder/100/100"}
            alt={`${author.name}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium">{author.name}</h3>
            <p className="text-gray-500 text-sm">{post.timestamp}</p>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="px-4 pb-2">
          <p className="mb-2">{post.content}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap mb-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-blue-600 text-sm mr-2">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* Post Image */}
        {post.image && (
          <div className="w-full">
            <img
              src={post.image}
              alt="Post content"
              className="w-full object-cover max-h-96"
            />
          </div>
        )}
        
        {/* Post Stats */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>{post.likes} likes</span>
          <span>{post.comments.length} comments</span>
        </div>
        
        {/* Post Actions */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-around">
          <button 
            onClick={() => handleLike(post.id)}
            className={`flex items-center space-x-1 ${post.likedByCurrentUser ? 'text-red-500' : 'text-gray-600'}`}
          >
            <Heart size={20} fill={post.likedByCurrentUser ? "currentColor" : "none"} />
            <span>Like</span>
          </button>
          
          <button 
            onClick={() => setCommentingOnPost(commentingOnPost === post.id ? null : post.id)}
            className="flex items-center space-x-1 text-gray-600"
          >
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>
          
          <button className="flex items-center space-x-1 text-gray-600">
            <Share2 size={20} />
            <span>Share</span>
          </button>
          
          <button className="flex items-center space-x-1 text-gray-600">
            <Bookmark size={20} />
            <span>Save</span>
          </button>
        </div>
        
        {/* Comments Section */}
        {(post.comments.length > 0 || commentingOnPost === post.id) && (
          <div className="px-4 py-3 bg-gray-50">
            {/* Existing Comments */}
            {post.comments.map(comment => {
              const commenter = getUserById(comment.userId);
              
              return (
                <div key={comment.id} className="flex items-start space-x-2 mb-3">
                  <img
                    src={commenter.avatar || "/api/placeholder/100/100"}
                    alt={`${commenter.name}'s avatar`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <p className="font-medium text-sm">{commenter.name}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span>{comment.timestamp}</span>
                      <button>Like</button>
                      <button>Reply</button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Add Comment Form */}
            {commentingOnPost === post.id && (
              <div className="flex items-start space-x-2 mt-3">
                <img
                  src={currentUser.avatar}
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 flex">
                  <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-200 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={newComment.trim() === ''}
                    className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderHomeFeed = () => (
    <div>
      {renderCreatePost()}
      {posts.map(renderPost)}
    </div>
  );

  const renderProfile = () => {
    const user = activeTab === 'profile' ? currentUser : users.find(u => u.id === 1);
    
    const userPosts = posts.filter(post => post.userId === user.id);
    
    return (
      <div>
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500" />
          
          {/* Profile Info */}
          <div className="p-4 relative">
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white absolute -top-12 left-4"
            />
            
            <div className="mt-14">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.username}</p>
                </div>
                
                {user.id !== currentUser.id && (
                  <button
                    onClick={() => handleFollow(user.id)}
                    className={`px-4 py-1 rounded-full font-medium ${
                      user.isFollowedByCurrentUser
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {user.isFollowedByCurrentUser ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              
              <p className="mt-2">{user.bio}</p>
              
              <div className="flex space-x-4 mt-4 text-sm">
                <div>
                  <span className="font-bold">{user.followers}</span> Followers
                </div>
                <div>
                  <span className="font-bold">{user.following}</span> Following
                </div>
                <div>
                  <span className="font-bold">{userPosts.length}</span> Posts
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User's Posts */}
        {userPosts.length > 0 ? (
          userPosts.map(renderPost)
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No posts yet.</p>
          </div>
        )}
      </div>
    );
  };

  const renderSearch = () => (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for people, posts, or tags..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      
      {searchQuery.trim() !== '' && (
        <div>
          {/* Users Results */}
          {searchResults.users && searchResults.users.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">People</h2>
              
              <div className="bg-white rounded-lg shadow-md divide-y">
                {searchResults.users.map(user => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-gray-600 text-sm">{user.username}</p>
                      </div>
                    </div>
                    
                    {user.id !== currentUser.id && (
                      <button
                        onClick={() => handleFollow(user.id)}
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          user.isFollowedByCurrentUser
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {user.isFollowedByCurrentUser ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Posts Results */}
          {searchResults.posts && searchResults.posts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Posts</h2>
              {searchResults.posts.map(renderPost)}
            </div>
          )}
          
          {/* No Results */}
          {(!searchResults.users || searchResults.users.length === 0) && 
           (!searchResults.posts || searchResults.posts.length === 0) && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold p-4 border-b">Notifications</h2>
      
      {notifications.length > 0 ? (
        <div className="divide-y">
          {notifications.map(notification => {
            const user = getUserById(notification.userId);
            
            let icon;
            if (notification.type === 'like') icon = <Heart size={16} className="text-red-500" />;
            else if (notification.type === 'comment') icon = <MessageCircle size={16} className="text-blue-500" />;
            else if (notification.type === 'follow') icon = <User size={16} className="text-green-500" />;
            
            return (
              <div key={notification.id} className="p-4 flex items-start space-x-3 hover:bg-gray-50">
                <div className="mt-1">{icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p>
                        <span className="font-medium">{user.name}</span>{' '}
                        {notification.content}
                      </p>
                      <p className="text-gray-500 text-sm">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {renderHeader()}
      
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'home' && renderHomeFeed()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'search' && renderSearch()}
        {activeTab === 'notifications' && renderNotifications()}
      </main>
    </div>
  );
}