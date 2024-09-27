let communityServicePosts = [];

// Fetch the JSON data from communityServicePosts.json
window.onload = async function () {
  try {
    const response = await fetch("data/community_service_posts.json");
    communityServicePosts = await response.json();
    generateCards(communityServicePosts); // Generate cards after loading data
  } catch (error) {
    console.error("Error fetching community service data:", error);
  }
};

// Function to create a card
function createCard(post) {
  const card = document.createElement("div");
  card.classList.add("card");

  // Create image element
  const img = document.createElement("img");
  img.src = post.image;
  img.alt = post.title;
  card.appendChild(img);

  // Create content div
  const content = document.createElement("div");
  content.classList.add("card-content");

  // Create and append the title
  const title = document.createElement("h2");
  title.textContent = post.title;
  content.appendChild(title);

  // Create and append the organization
  const org = document.createElement("p");
  org.textContent = post.organization;
  content.appendChild(org);

  // Create and append the description
  const desc = document.createElement("p");
  desc.textContent = post.description;
  content.appendChild(desc);

  // Create and append the view details button
  const button = document.createElement("button");
  button.textContent = "View Details";
  button.onclick = () => viewDetails(post.id);
  content.appendChild(button);

  // Append content div to card
  card.appendChild(content);

  return card;
}

// Function to generate cards dynamically
function generateCards(posts) {
  const container = document.getElementById("cards-container");
  container.textContent = ""; // Clear previous results

  posts.forEach((post) => {
    const card = createCard(post);
    container.appendChild(card);
  });
}

// Search functionality
function searchPosts() {
  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredPosts = communityServicePosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchValue) ||
      post.organization.toLowerCase().includes(searchValue) ||
      post.description.toLowerCase().includes(searchValue)
    );
  });
  generateCards(filteredPosts);
}

// Function to view details (This can be expanded to show a full details page)
function viewDetails(postId) {
  const post = communityServicePosts.find((post) => post.id === postId);
  alert(
    `Details of ${post.title}:\n\nOrganization: ${post.organization}\nDescription: ${post.description}\nStart Date: ${post.startDate}\nEnd Date: ${post.endDate}`
  );
}
