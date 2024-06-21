import PageLayout from "../components/PageLayout.tsx";

const Home = () => {
    return (
        <PageLayout>
            <h1 className="text-3xl font-bold mb-4">Welcome to the Annual Athletics Championship!</h1>
            <p className="text-lg">
                We are thrilled to have you join us for an exciting day of athletic excellence. Our annual championship brings together the best athletes from around the region to compete in a variety of track and field events. Whether you are here to compete, support a loved one, or simply enjoy the thrill of the competition, we are delighted to welcome you.
            </p>
            <p className="text-lg mt-4">
                Our competition features a range of events including sprints, long-distance races, relays, jumps, and throws. Athletes of all ages and skill levels will showcase their talents and push their limits in pursuit of personal bests and championship titles. We are committed to promoting sportsmanship, teamwork, and a spirit of healthy competition.
            </p>
            <p className="text-lg mt-4">
                Thank you to all our volunteers, sponsors, and supporters who make this event possible. Your dedication and enthusiasm are the heart of this championship. We encourage everyone to cheer loudly, respect all participants, and enjoy the day's events.
            </p>
            <p className="text-lg mt-4">
                Best of luck to all our competitors. May you run fast, jump high, throw far, and most importantly, have fun!
            </p>
        </PageLayout>
    );
}

export default Home;
