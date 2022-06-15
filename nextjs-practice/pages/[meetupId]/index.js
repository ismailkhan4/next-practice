import { MongoClient, ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetails = (props) => {
  useRouter();
  return (
    <MeetupDetail
      image={props.meetupData.image}
      title={props.meetupData.title}
      address={props.meetupData.address}
      description={props.meetupData.description}
    />
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://ismail:ismail123@nextjspractice.afqrx.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupCollection = db.collection('meetups');

  const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    'mongodb+srv://ismail:ismail123@nextjspractice.afqrx.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupCollection = db.collection('meetups');

  const selectedMeetup = await meetupCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
