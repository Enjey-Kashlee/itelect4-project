import UserCard from './assets/UserCard'
import ItemCard from './assets/ItemCard'
import ClaimBadge from './assets/ClaimBadge'
import type { User, Item, Claim } from './types/index'
import './App.css'

const sampleUser: User = {
  id: 1,
  name: 'Maria Santos',
  email: 'm@example.com',
  role: 'student',
  isActive: true,
}

const sampleItem: Item = {
  id: 101,
  title: 'Blue Water Bottle',
  description: 'Hydro Flask with a DLSL sticker',
  status: 'lost',
  location: 'Library, 2nd floor',
  reportedById: 1,
}

const sampleClaim: Claim = {
  id: 1,
  itemId: 101,
  claimantId: 1,
  claimedAt: new Date(),
  verified: false,
}

function App() {
  return (
    <section id="cards">
      <UserCard user={sampleUser} />
      <ItemCard item={sampleItem} />
      <ClaimBadge claim={sampleClaim} />
    </section>
  )
}

export default App
