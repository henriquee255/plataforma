import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * AvatarGroup - Grupo de avatares empilhados
 */
const AvatarGroup = ({
  users,
  max = 3,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.id || index}
          className={`border-2 border-background ${sizeClasses[size]}`}
        >
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className={`border-2 border-background ${sizeClasses[size]}`}>
          <AvatarFallback className="bg-muted text-muted-foreground">
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default AvatarGroup;
