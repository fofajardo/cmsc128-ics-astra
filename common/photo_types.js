const PhotoType = Object.freeze({
  PROFILE_PIC: 0,
  PROOF_OF_PAYMENT: 1,
  PROOF_OF_GRADUATION: 2,
  EVENT_PIC: 3,
  JOB_PIC: 4,
  PROJECT_PIC: 5,
  POSTS_PIC: 6,
  isDefined: function(aValue) {
    if (typeof aValue === "string" || aValue instanceof String) {
      const value = aValue.toLowerCase().trim();
      switch (value) {
      case PhotoType.PROFILE_PIC:
      case PhotoType.PROOF_OF_PAYMENT:
      case PhotoType.PROOF_OF_GRADUATION:
      case PhotoType.EVENT_PIC:
      case PhotoType.JOB_PIC:
      case PhotoType.PROJECT_PIC:
      case PhotoType.POSTS_PIC:
        return true;
      default:
        break;
      }
    }
    return false;
  },
  parse: function(aValue) {
    if (!this.isDefined(aValue)) {
      return null;
    }
    return parseInt(aValue);
  },
})

export { PhotoType };