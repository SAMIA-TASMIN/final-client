import React from 'react';
import Banner from './Banner';
import LatestResolvedIssues from '../Issues/LatestResolvedIssues';
import FeatureSection from './FeatureSection';
import HowItWorks from './HowItWorks';
import ExtraSectionTwo from './ExtraSectionTwo';
import Footer from './Footer';
import ExtraSectionOne from './ExtraSectionOne';

const Home = () => {
  return (
    <div>
     <Banner></Banner>
     <LatestResolvedIssues></LatestResolvedIssues>
     <FeatureSection></FeatureSection>
     <HowItWorks></HowItWorks>
     <ExtraSectionOne></ExtraSectionOne>
     <ExtraSectionTwo></ExtraSectionTwo>
     <Footer></Footer>

      
    </div>
  );
};

export default Home;