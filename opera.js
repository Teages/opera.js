class Opera {
  timeline = [
    // {
    //   id: Number, 
    //   time: 0,
    //   event: function(){}
    // }
  ];
  time;
  timeAnchor;
  played = -1;
  playState = 0;
  usedID = 0;
  constructor() {
    // nothing to do
  }
  addEvent(eventTime, event) {
    this.pause()
    let newEventID = this.usedID
    let newEvent = {
      id: newEventID,
      time: eventTime,
      event,
      remove: () => {
        this.removeEvent(newEventID)
      }
    }
    window.requestAnimationFrame(() => {
      if (eventTime < this.time) {
        played++
      }
      if (this.timeline.length < 1) {
        this.timeline.push(newEvent)
      } else {
        let p = 0;
        while (this.timeline[p].time <= eventTime) {
          p++
        }
        this.timeline.splice(p, 0, newEvent)
        usedID++
      }
      this.contiune()
    })
    return newEvent
  }
  // removeEvent(id) {
  //   for (let p of this.timeline) {
  //     e = this.timeline[p]
  //     if (e.id === id) {
  //       this.timeline.splice(p, 1)
  //       return
  //     }
  //   }
  // }
  start(startTime = 0) {
    this.playState = 1
    this.time = startTime
    this.played = -1
    window.requestAnimationFrame((timestamp) => { this.updateloop(timestamp) })
  }
  pause() {
    if (!this.playState) return
    this.playState = 0
  }
  contiune() {
    if (!this.playState) { this.start(0) }
    else {
      this.playState = 1
      window.requestAnimationFrame((timestamp) => { this.updateloop(timestamp) })
    }
  }
  stop() {
    this.playState = 0
    this.time = 0
    this.played = -1
  }
  updateloop(timestamp) {
    if (!this.timeAnchor) {
      this.timeAnchor = timestamp - this.time
    }
    switch (this.playState) {
      case 1:
        this.time = timestamp - this.timeAnchor;
        while (this.played < this.timeline.length - 1 && this.timeline[this.played + 1].time <= this.time) {
          this.timeline[this.played + 1].event()
          this.played++
        }
        if (this.played >= this.timeline.length - 1) { break }
        else { window.requestAnimationFrame((timestamp) => { this.updateloop(timestamp) }) }
        break;
      default:
        this.timeAnchor = timestamp - this.time
        break;
    }
  }
  getEvent(id) {
    if (this.timeline.length < 1) return null
    for (let p of this.timeline) {
      e = this.timeline[p]
      if (e.id === id) {
        return e
      }
    }
    return null
  }
}