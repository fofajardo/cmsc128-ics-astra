export const PROJECT_STATUS = {
  AWAITING_BUDGET: 0,
  ONGOING: 1,
  FINISHED: 2,
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUS.AWAITING_BUDGET]: "Awaiting Budget",
  [PROJECT_STATUS.ONGOING]: "Ongoing",
  [PROJECT_STATUS.FINISHED]: "Finished",
};

export const PROJECT_TYPE = {
  DONATION_DRIVE: "donation drive",
  FUNDRAISING: "fundraising",
  SCHOLARSHIP: "scholarship",
};