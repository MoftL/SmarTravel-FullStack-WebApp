// Function to format distance for instructions
export const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  } else {
    return `${(distance / 1000).toFixed(1)} km`;
  }
};

// Function to format time duration (minutes to hours/minutes)
export const formatDuration = (minutes) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  } else {
    return `${minutes}m`;
  }
};

// Function to get direction icon based on maneuver type
export const getDirectionIcon = (maneuver) => {
  const type = maneuver.type;
  const modifier = maneuver.modifier;
  
  switch (type) {
    case 'depart': return '🚗';
    case 'arrive': return '🏁';
    case 'turn':
      if (modifier === 'left') return '↰';
      if (modifier === 'right') return '↱';
      if (modifier === 'sharp left') return '⤴';
      if (modifier === 'sharp right') return '⤵';
      if (modifier === 'slight left') return '↖';
      if (modifier === 'slight right') return '↗';
      return '➡';
    case 'merge': return '🔀';
    case 'ramp':
    case 'on ramp': return '🛣';
    case 'off ramp': return '🚪';
    case 'fork': return '🍴';
    case 'roundabout':
    case 'rotary': return '🔄';
    case 'continue': return '⬆';
    default: return '➡';
  }
};

// Function to get instruction text
export const getInstructionText = (maneuver, roadName) => {
  const type = maneuver.type;
  const modifier = maneuver.modifier;

  // Create base instruction based on maneuver type
  switch(type) {
    case 'depart':
      return `Start your journey heading ${modifier || 'forward'} on ${roadName || 'the road'}.`;
    case 'turn':
      if (modifier === "left") return `Turn left onto ${roadName || 'the road'}.`;
      if (modifier === "right") return `Turn right onto ${roadName || 'the road'}.`;
      if (modifier === "sharp left") return `Make a sharp left onto ${roadName || 'the road'}.`;
      if (modifier === "sharp right") return `Make a sharp right onto ${roadName || 'the road'}.`;
      if (modifier === "slight left") return `Slight left onto ${roadName || 'the road'}.`;
      if (modifier === "slight right") return `Slight right onto ${roadName || 'the road'}.`;
      return `Turn onto ${roadName || 'the road'}.`;
    case 'merge':
      return `Merge ${modifier || ''} onto ${roadName || 'the highway'}`;
    case 'ramp':
      return `Take the ramp ${modifier || ''} onto ${roadName || 'continue'}`;
    case 'on ramp':
      return `Enter the highway via the on-ramp to ${roadName || 'the highway'}`;
    case 'off ramp':
      return `Take the off-ramp to ${roadName || 'exit'}`;
    case 'fork':
      return `At the fork, keep ${modifier || 'straight'} onto ${roadName || 'the road'}`;
    case 'end of road':
      return `Continue straight at the end of the road onto ${roadName || 'the road'}`;
    case 'continue':
      return `Continue on ${roadName || 'the current road'}`;
    case 'roundabout':
      const exit = maneuver.exit || 1;
      return `At the roundabout, take exit ${exit} onto ${roadName || 'the road'}.`;
    case 'rotary':
      return `Enter the rotary and follow signs to ${roadName || 'your destination'}.`;
    case 'arrive':
      return `You have arrived at your destination on ${roadName || 'the right'}.`;
    default:
      return `Continue to ${roadName || 'your destination'}.`;
  }
};