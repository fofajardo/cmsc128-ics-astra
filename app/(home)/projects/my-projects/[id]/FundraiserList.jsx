import FundraiserCard from "./FundraiserCard";
import EmptyState from "./EmptyState";

export default function FundraisersList({
  fundraisers,
  activeTab,
  onOpenEditModal,
  onOpenMessagesModal,
  onOpenRejectionDetailsModal,
  onToggleExpandFundraiser,
  expandedFundraiser,
  router
}) {
  const filteredFundraisers = fundraisers.filter((fundraiser) => {
    if (activeTab === "all") return true;
    return fundraiser.status === activeTab;
  });

  if (filteredFundraisers.length === 0) {
    return (
      <EmptyState
        activeTab={activeTab}
        message={
          activeTab === "all"
            ? "You haven't created any fundraisers yet. Start by creating your first fundraiser!"
            : `You don't have any ${activeTab} fundraisers at the moment.`
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {filteredFundraisers.map((fundraiser) => (
        <FundraiserCard
          key={fundraiser.id}
          fundraiser={fundraiser}
          isExpanded={expandedFundraiser === fundraiser.id}
          onOpenEditModal={() => onOpenEditModal(fundraiser)}
          onOpenMessagesModal={() => onOpenMessagesModal(fundraiser)}
          onOpenRejectionDetailsModal={() => onOpenRejectionDetailsModal(fundraiser)}
          onToggleExpand={() => onToggleExpandFundraiser(fundraiser.id)}
          router={router}
        />
      ))}
    </div>
  );
}