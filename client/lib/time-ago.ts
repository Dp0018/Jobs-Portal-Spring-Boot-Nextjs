export function timeAgo(time: string) {
    const now = new Date();
    const postDate = new Date(time);
    const diff = now.getTime()-postDate.getTime()

    const seconds = Math.floor(diff/1000)
    const minutes = Math.floor(seconds/60)
    const hours = Math.floor(minutes/60)
    const days = Math.floor(hours/24)
    const months = Math.floor(days/30)

    if(seconds <60){
        return `${seconds} seconds ago`
    }
    else if (minutes <60){
        return `${minutes} minutes ago`
    }
    else if (hours<24){
        return `${hours} hours ago`
    }
    else if (days<30){
        return `${days} days ago`
    }
    else {
        return `${months} months ago`
    }
}