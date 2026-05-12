import React from 'react'

function SearchUser() {
    return (
        <div className="p-4 border-b">
            <input
                type="text"
                placeholder="Search users..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    )
}

export default SearchUser