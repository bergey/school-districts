{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeSynonymInstances #-}
{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE DeriveDataTypeable #-}

module Main where

import           Control.Applicative
import           Control.Exception
import           Control.Monad
import qualified Data.ByteString as BS
import qualified Data.ByteString.Lazy as BL
import           Data.Csv
import           Data.List (sort)
import           Data.Text (Text)
import           Data.Typeable
import           Data.Vector (Vector)
import qualified Data.Vector as V
import           System.FilePath ((</>))

main :: IO ()
main = do
    details <- mapM decodeExpenditures years
    let summary = map summarize details
    BL.writeFile (dataPath </> "annual-expenditures-pa-phl.csv") .
        encodeByName header $ summary

-- | a row of input data
data District = District {
    _aun :: Int,
    _district :: Text,
    _expenditure :: Double -- ^ per student expenditure in a given year
    }

instance FromRecord District where
    parseRecord r
        | V.length r >= 12 = District <$> r .! 0 <*> r.! 1 <*> r .! 11
        | otherwise = mzero

instance FromNamedRecord District where
    parseNamedRecord r = District <$> r .: "AUN" <*> r .: "district" <*> r .: "total"

-- | A year of input data, and the year (end of the academic year)
data Yearly = Yearly Int (Vector District)

-- | a row of output data
data Summary = Summary {
    _startYear :: Int,
    _endYear :: Int,
    _philly :: Double,
    _median :: Double
                       }

instance ToNamedRecord Summary where
    toNamedRecord s = namedRecord [
        "startYear" .= _startYear s,
        "endYear" .= _endYear s,
        "Philadelphia" .= _philly s,
        "PA Median" .= _median s
        ]

data SchoolYear = SchoolYear Int FilePath

decodeExpenditures :: SchoolYear -> IO Yearly
decodeExpenditures (SchoolYear y fn) = do
    parseOrErr <- decode HasHeader <$> BL.readFile fn
    case parseOrErr of
     Left err -> throwIO . DataException $ err
     Right parse -> return $ Yearly y parse

years :: [SchoolYear]
years =  [SchoolYear i (fn i) | i <-[2006..2013]] where
  fn i = dataPath </> "expenditures-" ++ show (i-1) ++ "-" ++ show i ++ ".csv"

dataPath :: FilePath
dataPath = ".." </> "data"

summarize :: Yearly -> Summary
summarize (Yearly y ds) = Summary (y-1) y phl median where
  l = V.length ds
  phl = case V.find (\d -> _district d == "Philadelphia City SD") ds of
      Nothing -> throw . DataException $ "The CSV for " ++ show y ++ " does not have Philadelphia City SD"
      Just d -> _expenditure d
  sorted = sort . V.toList . V.map _expenditure $ ds
  median = case even l of
      True -> (sorted !! (l `div` 2 - 1) + sorted !! (l `div` 2)) / 2
      False -> sorted !! (l `div` 2)

header :: Vector BS.ByteString
header = V.fromList ["startYear", "endYear", "Philadelphia", "PA Median"]

data DataException = DataException String
                   deriving (Show, Typeable)

instance Exception DataException
