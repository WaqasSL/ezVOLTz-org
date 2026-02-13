import { errorMessage } from '../../config/config.js';
import VechicleManufactur from '../../models/VechicleManufacturModel.js';

export const getVehicleManufacture = async (req, res) => {
  try {
    const vehicleManufactur = await VechicleManufactur.find({})
      .sort({ make: 1 }) // Replace 'name' with the actual field you want to sort by
      .exec();
    res.status(200).send({ vehicleManufactur });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const addVehicleManufacture = async (req, res) => {
  try {
    const vehicle = await VechicleManufactur.insertMany(req.body);
    res.status(201).send({ vehicle });
  } catch (error) {
    errorMessage(res, error);
  }
};

export const updateVehicleModelsFromJson = async (req, res) => {
  try {
    const jsonData = req.body;
    
    if (!jsonData || !Array.isArray(jsonData)) {
      return res.status(400).send({ message: 'Invalid JSON data format. Expected an array.' });
    }
    
    const updateResults = [];
    const errors = [];
    const newManufacturers = [];
    
    // Process each manufacturer in the JSON
    for (const jsonManufacturer of jsonData) {
      // Find matching manufacturer in database by make_display
      let dbManufacturer = await VechicleManufactur.findOne({make: jsonManufacturer.make_display});
      
      // If manufacturer doesn't exist, create it with models
      if (!dbManufacturer) {
        console.log(`Creating new manufacturer: ${jsonManufacturer.make_display}`);
        
        // Get models from JSON
        const jsonModels = jsonManufacturer.models || [];
        
        // Process models for new manufacturer
        const initialModels = jsonModels.map(jsonModel => {
          const modelName = typeof jsonModel === 'string' ? jsonModel : jsonModel.model_name;
          if (!modelName) return null;
          
          // Create model object with standard structure
          return {
            model: modelName,
            year: null,
            trim: null
          };
        }).filter(model => model !== null); // Remove any null entries
        
        // Create new manufacturer with make and models
        const newManufacturer = new VechicleManufactur({
          make: jsonManufacturer.make_display,
          models: initialModels
        });
        
        // Save the new manufacturer
        dbManufacturer = await newManufacturer.save();
        newManufacturers.push({
          make: dbManufacturer.make,
          modelsCount: initialModels.length
        });
        
        updateResults.push({
          manufacturer: dbManufacturer.make,
          status: 'created',
          modelsAdded: initialModels,
          isNewManufacturer: true
        });
        
        continue; // Skip to next manufacturer since we've already added all models
      }
      
      // Get existing models from database
      const existingModels = dbManufacturer.models || [];
      
      // Get models from JSON
      const jsonModels = jsonManufacturer.models || [];
      
      // Find models that exist in JSON but not in database
      const modelsToAdd = [];
      
      for (const jsonModel of jsonModels) {
        // Extract model name from JSON model based on its structure
        const jsonModelName = typeof jsonModel === 'string' ? jsonModel : jsonModel.model_name;
        
        // Skip if jsonModelName is undefined or empty
        if (!jsonModelName) {
          console.log(`Skipping model with no name: ${JSON.stringify(jsonModel)}`);
          continue;
        }
        
        // Check if model already exists in database
        const modelExists = existingModels.some(dbModel => {
          // Extract model name from DB model based on its structure
          const dbModelName = typeof dbModel === 'string' ? dbModel : (dbModel.model || dbModel.name);
          
          // Case-insensitive comparison
          return dbModelName && jsonModelName && dbModelName.toLowerCase().trim() === jsonModelName.toLowerCase().trim();
        });
        
        if (!modelExists) {
          // Create new model object based on existing structure
          if (existingModels.length > 0 && typeof existingModels[0] === 'object') {
            // Get template from first existing model
            const templateModel = existingModels[0];
            const newModel = {};
            
            // Copy structure from template, filling with null values
            Object.keys(templateModel).forEach(key => {
              newModel[key] = null;
            });
            
            // Map JSON model properties to database model structure
            if (typeof jsonModel === 'string') {
              // If JSON model is just a string, use it as the model name
              const modelKey = 'model' in templateModel ? 'model' : 'name';
              newModel[modelKey] = jsonModel;
            } else {
              // If JSON model is an object, map its properties
              if ('model_name' in jsonModel && 'model' in templateModel) {
                newModel.model = jsonModel.model_name;
              } else if ('model_name' in jsonModel && 'name' in templateModel) {
                newModel.name = jsonModel.model_name;
              }
              
              // Map other properties if they exist in both
              Object.keys(jsonModel).forEach(key => {
                const dbKey = key === 'model_name' ? ('model' in templateModel ? 'model' : 'name') : key;
                if (dbKey in templateModel) {
                  newModel[dbKey] = jsonModel[key];
                }
              });
            }
            
            modelsToAdd.push(newModel);
          } else {
            // If existing models are strings, add new model as string
            modelsToAdd.push(jsonModelName);
          }
        }
      }
      
      if (modelsToAdd.length > 0) {
        // Add new models to existing ones
        const updatedModels = [...existingModels, ...modelsToAdd];
        
        // Update the manufacturer with new models
        const updated = await VechicleManufactur.findByIdAndUpdate(
          dbManufacturer._id,
          { models: updatedModels },
          { new: true }
        );
        
        updateResults.push({
          manufacturer: dbManufacturer.make,
          status: 'updated',
          modelsAdded: modelsToAdd,
          isNewManufacturer: false
        });
      } else {
        updateResults.push({
          manufacturer: dbManufacturer.make,
          status: 'unchanged',
          modelsAdded: [],
          message: 'No new models to add',
          isNewManufacturer: false
        });
      }
    }
    
    res.status(200).send({
      message: 'Vehicle models update completed',
      newManufacturersCreated: newManufacturers,
      results: updateResults,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error updating vehicle models:', error);
    errorMessage(res, error);
  }
};

export const cleanupVehicleModels = async (req, res) => {
  try {
    // Get all vehicle manufacturers
    const manufacturers = await VechicleManufactur.find({make: req.body.make});
    const results = [];

    for (const manufacturer of manufacturers) {
      const originalModelsCount = manufacturer.models ? manufacturer.models.length : 0;
      
      // Skip if no models exist
      if (!manufacturer.models || originalModelsCount === 0) {
        results.push({
          manufacturer: manufacturer.make,
          status: 'skipped',
          reason: 'No models found'
        });
        continue;
      }

      // Filter out models that don't have a 'model' key
      const validModels = manufacturer.models.filter(model => {
        // Keep string models or objects that have a 'model' key
        return typeof model === 'string' || (model && model.model !== undefined);
      });

      const removedCount = originalModelsCount - validModels.length;
      
      if (removedCount > 0) {
        // Update the manufacturer with the filtered models
        await VechicleManufactur.findByIdAndUpdate(
          manufacturer._id,
          { models: validModels }
        );
        
        results.push({
          manufacturer: manufacturer.make,
          status: 'updated',
          originalCount: originalModelsCount,
          newCount: validModels.length,
          removedCount
        });
      } else {
        results.push({
          manufacturer: manufacturer.make,
          status: 'unchanged',
          count: originalModelsCount
        });
      }
    }

    res.status(200).send({
      message: 'Vehicle models cleanup completed',
      results
    });
  } catch (error) {
    console.error('Error cleaning up vehicle models:', error);
    errorMessage(res, error);
  }
};
